import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { StudentUserNameDialog } from "../components/Components";

const GameDetails = ({ gameData, setUserName, userName }) => {
  const { otp } = useParams();
  const { joinGame, getLobbyData } = useUserAuth();

  const [lobbyData, setLobbyData] = useState(null);
  const [showUserNameDialog, setShowUserNameDialog] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLobby, setShowLobby] = useState(true); // Assuming you have this state defined somewhere

  const handleUserNameEnter = async () => {
    const result = await joinGame(otp, userName);
    if (result.success) {
      setShowUserNameDialog(false);
      setErrorMessage("");
    } else {
      setErrorMessage(result.message);
      setShowUserNameDialog(false);
    }
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  useEffect(() => {
    const unsubscribe = getLobbyData(otp, setLobbyData);
    if (userName) {
      setShowUserNameDialog(false);
    }
    return () => unsubscribe();
  }, [otp, getLobbyData]);

  const sortedLobbyData = lobbyData
    ? [...lobbyData].sort((a, b) => {
        if (a === userName) return -1; // User's name comes first
        if (b === userName) return 1; // User's name comes first
        return 0;
      })
    : [];

  return (
    <div>
      {showUserNameDialog && (
        <StudentUserNameDialog
          enteredUserName={userName}
          setUserNameEntered={setUserName}
          handleUserNameEnter={handleUserNameEnter}
          handleUserNameChange={handleUserNameChange}
          errorMessage={errorMessage}
        />
      )}

      <div>
        {userName && <p>UserName: {userName}</p>}
        <p>Game: {gameData.GameName}</p>
        {gameData.IsGameStarted ? <p>Game is Live</p> : <p>Game is Not Live</p>}
      </div>

      {showLobby && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Players in Lobby:</h2>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {sortedLobbyData.map((player, index) => (
              <li
                key={index}
                className={`rounded-lg shadow-md overflow-hidden ${
                  player === userName ? "bg-yellow-100" : ""
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

export default GameDetails;
