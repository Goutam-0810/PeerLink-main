package p2p.services;

import p2p.utils.UploadUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;

public class FileSharer {
    private HashMap<Integer, String > availableFile;

    public FileSharer() {
        availableFile = new HashMap<>();
    }

    public int offerFile(String filePath) {
        int port;
        while (true) {
            port = UploadUtils.generateCode();
            if(!availableFile.containsKey(port)) {
                availableFile.put(port,filePath);
                return port;
            }
        }
    }

    public void startFileServer(int port){
        String filePath = availableFile.get(port);
        if(filePath == null){
            System.out.println("No File is associated with the port" + port);
            return ;
        }

        try(ServerSocket serversocket = new ServerSocket(port)){
            System.out.println("Serving file" + new File(filePath).getName() + "on port" + port);
            Socket clientSocket = serversocket.accept();
            System.out.println("Client connection: "+ clientSocket.getInetAddress());
            new  Thread(new FileSenderHandler(clientSocket, filePath)).start();
        }
        catch (IOException E){
            System.out.println("Error handling file server on port"+ port);
        }
    }
    private static class FileSenderHandler implements Runnable{
        private final Socket clientSocket;
        private final String filePath;

        public FileSenderHandler(Socket clientSocket,String filePath){
            this.clientSocket = clientSocket;
            this.filePath = filePath;
        }
        @Override
        public void run(){
            try(FileInputStream fis = new  FileInputStream(filePath)){
                OutputStream oos = clientSocket.getOutputStream();
                String filename =new File(filePath).getName();
                String Header= "FileName: "+ filename +"/n";
                oos.write(Header.getBytes());

                byte [] buffer = new byte[4096];
                int byteRead;
                while((byteRead = fis.read(buffer)) != -1){
                    oos.write(buffer,0,byteRead);
                }
                System.out.println("File "+ filename + " sent to "+ clientSocket.getInetAddress());
            }
            catch (IOException E){
                System.out.println("Error Sending file to the client" + E.getMessage());
            } finally {
                try {
                clientSocket.close();
                }
                catch (Exception E){
                    System.err.println("Error closing file socket" + E.getMessage());
                }
            }
        }
    }
}
