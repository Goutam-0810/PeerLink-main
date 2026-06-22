'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  FaUpload,
  FaDownload,
  FaBolt,
  FaLock,
  FaGlobe
} from 'react-icons/fa';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';


export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setPort(response.data.port);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDownload = async (port: number) => {
    setIsDownloading(true);
    
    try {
      // Request download from Java backend
      const response = await axios.get(`/api/download/${port}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get filename from response headers
      // Axios normalizes headers to lowercase, but we need to handle different cases
      const headers = response.headers;
      let contentDisposition = '';
      
      // Look for content-disposition header regardless of case
      for (const key in headers) {
        if (key.toLowerCase() === 'content-disposition') {
          contentDisposition = headers[key];
          break;
        }
      }
      
      let filename = 'downloaded-file';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please check the invite code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
     <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
    <nav className="flex justify-between items-center mb-12">
      <div className="text-2xl font-bold text-white">
        🔗 PEERLINK
      </div>

      <div className="flex gap-6 text-gray-200">
        <a
          href="https://github.com/Goutam-0810/PeerLink-main/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition"
        >
          GitHub
        </a>

        <a
          href="/features"
          className="hover:text-white transition"
        >
          Features
        </a>
      </div>
    </nav>
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Secure File Sharing Made Simple
        </h1>

        <p className="text-xl text-gray-200">
          Share files instantly using a secure invite code.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>

          <span className="text-sm text-green-200">
            Service Online
          </span>
        </div>
      </header>
      
      <div className="
      bg-white/10
      backdrop-blur-lg
      border
      border-white/20
      rounded-3xl
      shadow-2xl
      p-8
      ">
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Share a File
          </button>
          <button
            className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === 'download'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30'
            }`}
            onClick={() => setActiveTab('download')}
          >
            Receive a File
          </button>
        </div>
        
        {activeTab === 'upload' ? (
          <div>
            <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            
            {uploadedFile && !isUploading && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  Selected file: <span className="font-medium">{uploadedFile.name}</span> ({Math.round(uploadedFile.size / 1024)} KB)
                </p>
              </div>
            )}
            
            {isUploading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Uploading file...</p>
              </div>
            )}
            
            <InviteCode port={port} />
          </div>
        ) : (
          <div>
            <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />
            
            {isDownloading && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Downloading file...</p>
              </div>
            )}
          </div>
        )}
      </div>
      <div id="features" className="grid md:grid-cols-3 gap-6 mt-10">

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
          <FaBolt className="mx-auto text-4xl mb-3 text-yellow-300" />
          <h3 className="font-bold text-lg text-white">
            Fast Transfer
          </h3>
          <p className="text-gray-200">
            Direct peer-to-peer file sharing.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
          <FaLock className="mx-auto text-4xl mb-3 text-green-300" />
          <h3 className="font-bold text-lg text-white">
            Secure
          </h3>
          <p className="text-gray-200">
            Share files safely with invite codes.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center">
          <FaGlobe className="mx-auto text-4xl mb-3 text-cyan-300" />
          <h3 className="font-bold text-lg text-white">
            Global Access
          </h3>
          <p className="text-gray-200">
            Share files anywhere.
          </p>
        </div>
      </div>
            <footer className="mt-12 text-center text-white/80 text-sm">
              <p className="mt-2">
                © {new Date().getFullYear()} PeerLink
              </p>
            </footer>
          </motion.div>
        );
      }
