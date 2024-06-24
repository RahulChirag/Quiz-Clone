import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { FaCopy } from "react-icons/fa";

const HostGame = ({ gameData, isStarterContent, gameType }) => {
  const { setGameLive, stopLive, startGame, stopGame, getLobbyData } =
    useUserAuth();

  const [otp, setOtp] = useState();
  const [normalLink, setNormalLink] = useState();
  const [url, setUrl] = useState();
  const [copiedLink, setCopiedLink] = useState(null);
  const [lobbyData, setLobbyData] = useState([]);

  const [hosting, setHosting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLobby, setShowLobby] = useState(false);

  const bgColors = [
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-red-200",
    "bg-indigo-200",
    "bg-gray-200",
  ];

  useEffect(() => {
    generateOtp();
  }, [gameData]);

  useEffect(() => {
    if (hosting) {
      const unsubscribe = getLobbyData(otp, setLobbyData);
      return () => unsubscribe();
    }
  }, [hosting, otp]);

  const generateOtp = () => {
    const otpValue = String(
      Math.floor(Math.random() * 999999)
        .toString()
        .padStart(6, "0")
    );
    setOtp(otpValue);
    generateLink(otpValue);
  };

  const generateLink = (otpValue) => {
    const Normalurl = `${window.location.origin}/live`;
    const urlValue = `${window.location.origin}/live/${otpValue}`;

    setNormalLink(Normalurl);
    setUrl(urlValue);
  };

  const handleHostGame = () => {
    setHosting(true);
    setGameLive(otp, gameData, isStarterContent, gameType);
    setShowLobby(true);
  };

  const handleStopHosting = () => {
    setHosting(false);
    setGameStarted(false);
    stopLive(otp);
    generateOtp();
  };

  const handleStartGame = () => {
    setGameStarted(true);
    startGame(otp);
  };

  const handleStopGame = () => {
    setGameStarted(false);
    stopGame(otp);
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopiedLink(link);
      setTimeout(() => {
        setCopiedLink(null);
      }, 2000);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-4">
        Game: {decodeURIComponent(gameData)}
      </h1>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">OTP:</h2>
        <div className="flex items-center">
          <p
            className="text-lg cursor-pointer bg-slate-100 p-1 rounded-md hover:bg-green-200 flex-grow"
            onClick={() => handleCopyLink(otp)}
            title="Click to copy OTP"
          >
            {otp}
          </p>
          <FaCopy
            className="text-lg cursor-pointer ml-2"
            onClick={() => handleCopyLink(otp)}
            title="Copy OTP"
          />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Normal Link:</h2>
        <div className="flex items-center">
          <p
            className="text-lg cursor-pointer bg-slate-100 p-1 rounded-md hover:bg-green-200 flex-grow"
            onClick={() => handleCopyLink(normalLink)}
            title="Click to copy Normal Link"
          >
            {normalLink}
          </p>
          <FaCopy
            className="text-lg cursor-pointer ml-2"
            onClick={() => handleCopyLink(normalLink)}
            title="Copy Normal Link"
          />
        </div>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Link:</h2>
        <div className="flex items-center">
          <p
            className="text-lg cursor-pointer bg-slate-100 p-1 rounded-md hover:bg-green-200 flex-grow"
            onClick={() => handleCopyLink(url)}
            title="Click to copy Link"
          >
            {url}
          </p>
          <FaCopy
            className="text-lg cursor-pointer ml-2"
            onClick={() => handleCopyLink(url)}
            title="Copy Link"
          />
        </div>
      </div>
      <div className="mb-4">
        {!hosting && (
          <button
            onClick={handleHostGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 mr-2"
          >
            Host Game
          </button>
        )}
        {hosting && (
          <button
            onClick={handleStopHosting}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 mr-2"
          >
            Stop Hosting
          </button>
        )}
        {hosting && !gameStarted && (
          <button
            onClick={handleStartGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-300 mr-2"
          >
            Start Game
          </button>
        )}
        {gameStarted && (
          <button
            onClick={handleStopGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 mr-2"
          >
            Stop Game
          </button>
        )}
      </div>
      {copiedLink && (
        <p className="text-green-500">Text copied to clipboard!</p>
      )}
      {showLobby && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Players in Lobby:</h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {lobbyData.map((player, index) => (
              <li
                key={index}
                className={`rounded-lg shadow-md overflow-hidden ${
                  bgColors[index % bgColors.length]
                }`}
              >
                <div className="p-4">
                  <p className="text-lg font-semibold">{player}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HostGame;
