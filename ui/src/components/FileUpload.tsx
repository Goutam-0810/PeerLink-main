'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);
  
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

return (
  <div
    {...getRootProps()}
    className={`
      w-full
      p-12
      border-2
      border-dashed
      rounded-3xl
      text-center
      cursor-pointer
      transition-all
      duration-300
      backdrop-blur-md

      ${
        dragActive
          ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]'
          : 'border-white/50 bg-white/5 hover:border-cyan-300 hover:bg-white/10'
      }

      ${isUploading ? 'opacity-50 pointer-events-none' : ''}
    `}
  >
    <input {...getInputProps()} />

    <div className="flex flex-col items-center justify-center">

      <div
        className="
          mb-6
          p-5
          rounded-full
          bg-gradient-to-r
          from-blue-500
          to-cyan-400
          shadow-lg
        "
      >
        <FiUpload className="w-10 h-10 text-white" />
      </div>

      <h3 className="text-3xl font-bold text-white mb-3">
        Upload Your File
      </h3>

      <p className="text-lg text-gray-200 mb-2">
        Drag & drop files here
      </p>

      <p className="text-gray-300 mb-6">
        or click anywhere to browse
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
          PDF
        </span>

        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
          DOCX
        </span>

        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
          ZIP
        </span>

        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
          PNG
        </span>

        <span className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-200">
          JPG
        </span>
      </div>

    </div>
  </div>
);
}