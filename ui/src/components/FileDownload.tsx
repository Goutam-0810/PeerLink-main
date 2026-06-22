'use client';

import { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

interface FileDownloadProps {
  onDownload: (port: number) => Promise<void>;
  isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const port = parseInt(inviteCode.trim(), 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      setError('Please enter a valid port number (1-65535)');
      return;
    }
    
    try {
      await onDownload(port);
    } catch (err) {
      setError('Failed to download the file. Please check the invite code and try again.');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20">
        <h3 className="text-xl font-bold text-white mb-2">
          📥 Receive a File
        </h3>

        <p className="text-gray-200">
          Enter the invite code to securely download a shared file.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="inviteCode"
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            Invite Code
          </label>

          <input
            type="text"
            id="inviteCode"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="e.g. 52341"
            className="
              w-full
              px-4
              py-3
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              placeholder:text-gray-300
              focus:outline-none
              focus:ring-2
              focus:ring-cyan-400
            "
            disabled={isDownloading}
            required
          />

          {error && (
            <p className="mt-2 text-sm text-red-300 font-medium">
              ⚠ {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="
            w-full
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-gradient-to-r
            from-blue-500
            to-cyan-500
            hover:from-blue-600
            hover:to-cyan-600
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span>Downloading...</span>
          ) : (
            <>
              <FiDownload className="mr-2" />
              <span>Download File</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}