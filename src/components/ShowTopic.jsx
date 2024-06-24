import React from "react";
import { useNavigate } from "react-router-dom";

const ShowTopic = ({ topicData, setGameType }) => {
  const navigate = useNavigate();

  const handleGameTypeClick = (gameType) => {
    if (typeof topicData.isStarterContent === "undefined") {
      return (topicData.isStarterContent = false);
    }
    const gameData = `${topicData.board}-${topicData.grade}-${topicData.tag}-${gameType}-${topicData.title}`;
    setGameType(gameType);
    navigate(
      `/dashboard/${encodeURIComponent(gameData)}/${encodeURIComponent(
        topicData.isStarterContent
      )}`
    );
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
        <div className="mb-4">
          <img
            src={topicData.imgUrl}
            alt={topicData.title}
            className="h-auto max-h-80 object-cover rounded-lg mx-auto"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {topicData.title}
          </h2>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Subject:</span> {topicData.tag}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Board:</span> {topicData.board}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Grade:</span> {topicData.grade}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Chapter:</span> {topicData.chapter}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {topicData.gameTypes.map((gameType) => (
            <button
              key={gameType}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => handleGameTypeClick(gameType)}
            >
              {gameType}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowTopic;
