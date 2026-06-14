package p2p.controller;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.apache.commons.io.IOUtils;
import p2p.services.FileSharer;
import java.io.*;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.UUID;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FileController {
    private final FileSharer fileSharer;
    private final HttpServer server;
    private final String uploadDir;
    private final ExecutorService executorService;

    public FileController(int port) throws IOException {
        this.fileSharer = new FileSharer();
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        this.uploadDir = System.getProperty("java.io.tmpdir") + File.separator + "peerlink-uploads";
        this.executorService = Executors.newFixedThreadPool(10);

        File uploadDirFile = new File(uploadDir);
        if(!uploadDirFile.exists()) {
            uploadDirFile.mkdirs();
        }

        server.createContext("/upload",new uploadHandler());
        server.createContext("/download",new DownloadHandler());
        server.createContext("/" , new CORSHandler());
        server.setExecutor(executorService);
    }
    public void start(){
        server.start();
        System.out.println("API Server started on port "+ server.getAddress().getPort());
    }
    public void stop(){
        server.stop(0);
        executorService.shutdown();
        System.out.println("API Server stopped");
    }

    private class CORSHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange ) throws IOException{
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if(exchange.getRequestMethod().equals("OPTIONS")){
                exchange.sendResponseHeaders(204,-1);
                return;
            }
            String response = "NOT FOUND";
            exchange.sendResponseHeaders(404, response.getBytes().length);
            try (OutputStream oos = exchange.getResponseBody()) {
                oos.write(response.getBytes());
            }
        }
    }

    private class uploadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException{
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            if(!exchange.getRequestMethod().equalsIgnoreCase("POST")){
                String response = "METHOD NOT ALLOWED";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                 try(OutputStream oos = exchange.getResponseBody()) {
                     oos.write(response.getBytes());
                 }
                 return;
            }
            Headers requestHeaders =  exchange.getRequestHeaders();
            String contentType = requestHeaders.getFirst("Content-Type");
            if(contentType == null || !contentType.startsWith("multipart/form-data")){
                String response ="BAD REQUEST: Content-Type must be multipart/form-data";
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try(OutputStream oos = exchange.getResponseBody()) {
                    oos.write(response.getBytes());
                }
                return;
            }
            try{
                String boundry = contentType.substring(contentType.indexOf("boundary=") + 9);
                ByteArrayOutputStream baos = new  ByteArrayOutputStream();

                IOUtils.copy(exchange.getRequestBody(), baos);
                byte[] requestData = baos.toByteArray();

                Multiparser parser = new Multiparser(requestData, boundry );
                Multiparser.ParseResult result = parser.parse();

                if(result == null){
                    String response =  "BAD REQUEST: Could not parse file content";
                    exchange.sendResponseHeaders(400, response.getBytes().length);
                    try(OutputStream oos = exchange.getResponseBody()) {
                        oos.write(response.getBytes());
                    }
                    return;
                }
                String filename= result.filename;
                if(filename == null || filename.trim().isEmpty()){
                    filename = "Unnamed-file";
                }
                String uniqueFilename = UUID.randomUUID().toString() + "-" +new File (filename).getName();
                String filePath = uploadDir + File.separator + uniqueFilename;

                try(FileOutputStream fos = new FileOutputStream(filePath)){
                    fos.write(result.fileContent);
                }
                int port = fileSharer.offerFile(filePath);
                new Thread(() -> fileSharer.startFileServer(port)).start();
                String jsonResponse = "{\"port\":" + port + "}";
                headers.add("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, jsonResponse.getBytes().length);
                try(OutputStream oos = exchange.getResponseBody()) {
                    oos.write(jsonResponse.getBytes());
                }
            }
            catch(Exception e){
                System.err.println("Error Processing File Upload"+e.getMessage());
                String response ="Server Error: "+e.getMessage();
                exchange.sendResponseHeaders(500, response.getBytes().length);
                try(OutputStream oos = exchange.getResponseBody()) {
                    oos.write(response.getBytes());
                }
            }
        }
    }


private static class Multiparser {
    private final byte[] data;
    private final String boundary;

    public Multiparser(byte[] data, String boundary) {
        this.data = data;
        this.boundary = boundary;
    }

    public ParseResult parse() {
        try {
            String dataAsString = new String(data);
            String filenameMarker = "filename=\"";
            int filenameStart = dataAsString.indexOf(filenameMarker);
            if (filenameStart == -1) {
                return null;
            }
            filenameStart += filenameMarker.length();
            int fileNameEnd = dataAsString.indexOf("\"", filenameStart);
            String filename = dataAsString.substring(filenameStart, fileNameEnd);

            String contentTypeMarker = "Content-Type: ";
            int contentTypeStart = dataAsString.indexOf(contentTypeMarker, fileNameEnd);
            String contentType = "application/octet-stream";

            if (contentTypeStart != -1) {
                contentTypeStart += contentTypeMarker.length();
                int contentTypeEnd = dataAsString.indexOf("\r\n", contentTypeStart);
                contentType = dataAsString.substring(contentTypeStart, contentTypeEnd);
            }

            String headerEndMarker = "\r\n\r\n";
            int headerEnd = dataAsString.indexOf(headerEndMarker);
            if (headerEnd == -1) {
                return null;
            }
            int contentStart = headerEnd + headerEndMarker.length();

            byte[] boundryBytes = ("\r\n--" + boundary + "--").getBytes();
            int contentEnd = findSequence(data, boundryBytes, contentStart);
            if (contentEnd == -1) {
                boundryBytes = ("\r\n--" + boundary).getBytes();
                contentEnd = findSequence(data, boundryBytes, contentStart);
            }
            if (contentEnd == -1 || contentEnd <= contentStart) {
                return null;
            }

            byte[] fileContent = new byte[contentEnd - contentStart];
            System.arraycopy(data, contentStart, fileContent, 0, fileContent.length);
            return new ParseResult(filename, fileContent, contentType);
        } catch (Exception e) {
            System.out.println("Error parsing multipart data" + e.getMessage());
            return null;
        }
    }

    public static class ParseResult {
        private final String filename;
        private final byte[] fileContent;
        private final String contentType;

        public ParseResult(String filename, byte[] fileContent, String contentType) {
            this.filename = filename;
            this.fileContent = fileContent;
            this.contentType = contentType;
        }
    }

    private static int findSequence(byte[] data, byte[] sequence, int startPos) {
        outer:
        for (int i = 0; i <= data.length - sequence.length; i++) {
            for (int j = 0; j < sequence.length; j++) {
                if (data[i + j] != sequence[j]) {
                    continue outer;
                }
            }
            return i;
        }
        return -1;
    }
    }
    private class DownloadHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");

            if(! exchange.getRequestMethod().equalsIgnoreCase("GET")) {
                String response= "Method not allowed ";
                exchange.sendResponseHeaders(405, response.getBytes().length);
                try(OutputStream oos = exchange.getResponseBody()) {
                    oos.write(response.getBytes());
                }
                return;
            }
            String path = exchange.getRequestURI().getPath();
            String portStr =path.substring(path.lastIndexOf("/")+1);
            try{
                int port = Integer.parseInt(portStr);
                try(Socket socket = new Socket("localhost",port)){
                    InputStream socketInput = socket.getInputStream();
                    File tempFile = File.createTempFile("download", ".tmp");
                    String filename = "downloaded-file";
                    try(FileOutputStream fos = new FileOutputStream(tempFile)){
                        byte [] buffer = new byte[4096];
                        int byteRead;
                        ByteArrayOutputStream headerBaos =  new ByteArrayOutputStream();
                        int b;
                        while((b = socketInput.read()) != -1){
                            if(b == '\n') break;
                            headerBaos.write(b);
                        }
                        String header = headerBaos.toString().trim();
                        if(header.startsWith("Filename: ")) {
                             filename = header.substring("Filename: ".length());
                        }
                        int off =0;
                        while ((byteRead = socketInput.read(buffer)) != -1) {
                            fos.write(buffer, 0, byteRead);
                            off+= byteRead;
                        }
                    }
                    headers.add("Content-Disposition ", "attachment; filename=\"" +filename+"\"" );
                    headers.add("Content-Type", "application/octet-stream");
                    exchange.sendResponseHeaders(200, tempFile.length());
                    try(OutputStream oos = exchange.getResponseBody()) {
                        FileInputStream fis  = new FileInputStream(tempFile);
                        byte[] buffer = new byte[4096];
                        int bytesRead;
                        while((bytesRead = fis.read(buffer)) != -1) {
                            oos.write(buffer, 0, bytesRead);
                        }
                    }
                    tempFile.delete();
                }
            } catch(Exception e){
                System.err.println("Error Download the file"+e.getMessage());
                String response =  "Error downloading the file"+e.getMessage();
                headers.add("Content-Type", "text/plain");
                exchange.sendResponseHeaders(400, response.getBytes().length);
                try(OutputStream oos = exchange.getResponseBody()) {
                    oos.write(response.getBytes());
                }
            }
        }
    }
}
