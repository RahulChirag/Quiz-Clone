import React from "react";

const ShowGameTitle = ({ gameTitle }) => {
  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-6">
      <div className="text-5xl font-extrabold text-white bg-blue-500 p-8 rounded-xl shadow-lg">
        {gameTitle}
      </div>
    </main>
  );
};

export default ShowGameTitle;
