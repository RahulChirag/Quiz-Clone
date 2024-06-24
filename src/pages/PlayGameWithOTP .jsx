import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { Loading, Game, GameDetailes } from "../components/Components";
const PlayGameWithOTP = () => {
  const { otp } = useParams();
  const { getGameData, joinGame } = useUserAuth();
  const [gameData, setGameData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getGameData(
      otp,
      (data) => {
        setGameData(data);
        setLoading(false);
      },
      (error) => {
        setErrorMessage(error);
        setLoading(false);
      }
    );

    // Clean-up function
    return () => unsubscribe();
  }, [otp, getGameData]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {gameData !== null ? (
        gameData.IsGameLive === true ? (
          gameData.IsGameStarted === true ? (
            userName && <Game gameData={gameData} userName={userName} />
          ) : (
            <GameDetailes
              gameData={gameData}
              otp={otp}
              userName={userName}
              setUserName={setUserName}
            />
          )
        ) : (
          <h1>Live Ended</h1>
        )
      ) : (
        <h1>Did not start the Live</h1>
      )}
    </div>
  );
};

export default PlayGameWithOTP;
