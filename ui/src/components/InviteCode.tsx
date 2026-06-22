'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface InviteCodeProps {
  port: number | null;
}

export default function InviteCode({ port }: InviteCodeProps) {
  const [copied, setCopied] = useState(false);
  
  if (!port) return null;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(port.toString());
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = port.toString();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="mt-6 p-5 bg-green-500/10 border border-green-400/30 rounded-2xl backdrop-blur-md">
      <h3 className="text-lg font-bold text-green-300"></h3>
      <p className="text-sm text-green-200 mb-3">
        Share this invite code with anyone you want to share the file with:
      </p>
      
      <div className="flex items-center">
        <div className="
          flex-1
          bg-white/10
          border
          border-white/20
          p-4
          rounded-l-xl
          font-mono
          text-2xl
          font-bold
          text-white
          tracking-wider
          text-center
        ">
          {port}
        </div>
        <button
          onClick={copyToClipboard}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-r-md transition-colors"
          aria-label="Copy invite code"
        >
          {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
        </button>
      </div>
      
      <p className="mt-3 text-xs text-gray-500">
        This code will be valid as long as your file sharing session is active.
      </p>
    </div>
  );
}
