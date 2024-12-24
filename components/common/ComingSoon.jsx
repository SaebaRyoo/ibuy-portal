const ComingSoon = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Coming Soon</h1>
        <p className="mt-4 text-lg text-gray-600">
          We&apos;re working hard to bring you something amazing. Stay tuned!
        </p>
        <div className="mt-6">
          <input
            type="email"
            className="w-full max-w-sm px-4 py-2 text-gray-900 bg-white border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your email"
          />
          <button className="w-full px-4 py-2 mt-4 font-medium text-white bg-indigo-600 rounded-md shadow sm:mt-0 sm:ml-2 sm:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Notify Me
          </button>
        </div>
        <div className="mt-8 text-sm text-gray-500">No spam, just updates about our launch.</div>
      </div>
    </div>
  )
}

export default ComingSoon
