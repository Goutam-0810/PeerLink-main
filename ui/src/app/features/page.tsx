export default function FeaturesPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 text-white">

      <div className="mb-12">
        <a
          href="/"
          className="
            inline-flex
            items-center
            gap-3
            px-5
            py-3
            rounded-full
            bg-white/10
            backdrop-blur-lg
            border
            border-white/20
            text-white
            font-medium
            hover:bg-white/20
            hover:scale-105
            transition-all
            duration-300
            shadow-lg
          "
        >
          <span className="text-lg">←</span>
          <span>Back to Home</span>
        </a>
      </div>

      <h1 className="text-5xl font-bold text-center mb-4">
        PeerLink Features
      </h1>

      <p className="text-center text-gray-300 text-xl mb-16">
        Everything you need to share files quickly, securely, and effortlessly.
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">🚀 Fast File Sharing</h2>
          <p className="text-gray-200">
            Transfer files instantly using a simple invite code.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">🔒 Secure Transfers</h2>
          <p className="text-gray-200">
            Unique access codes help keep file transfers private.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">⚡ Real-Time Downloads</h2>
          <p className="text-gray-200">
            Download files immediately after receiving the invite code.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-3">👤 No Account Required</h2>
          <p className="text-gray-200">
            No signup. No login. Just upload and share.
          </p>
        </div>

      </div>

      <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-3xl p-10">

        <h2 className="text-4xl font-bold text-center mb-10">
          How PeerLink Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6 text-center">

          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
              1
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Upload
            </h3>

            <p className="text-gray-200 mt-2">
              Select any file from your device.
            </p>
          </div>

          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold">
              2
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Get Code
            </h3>

            <p className="text-gray-200 mt-2">
              Receive a unique sharing code.
            </p>
          </div>

          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500 flex items-center justify-center text-2xl font-bold">
              3
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Share
            </h3>

            <p className="text-gray-200 mt-2">
              Send the code to the recipient.
            </p>
          </div>

          <div>
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center text-2xl font-bold">
              4
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Download
            </h3>

            <p className="text-gray-200 mt-2">
              Recipient downloads the file instantly.
            </p>
          </div>

        </div>

      </div>

      <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-2xl p-10 text-center">

        <h2 className="text-4xl font-bold mb-4">
          🚀 Ready to Share Files?
        </h2>

        <p className="text-gray-200 text-lg mb-6">
          Start transferring files securely in seconds. No signup, no hassle.
        </p>

        <a
          href="/"
          className="
            inline-block
            px-8
            py-4
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-cyan-500
            hover:from-blue-600
            hover:to-cyan-600
            transition-all
            duration-300
            font-semibold
            text-white
            shadow-lg
            hover:scale-105
          "
        >
          Start Sharing
        </a>

      </div>

    </div>
  );
}