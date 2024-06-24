import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-center space-x-8">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse"></div>
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full animate-pulse"></div>
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>
      <div className="text-xl font-medium text-gray-700 dark:text-gray-200 animate-bounce"></div>
    </div>
  );
};

export default Loading;
