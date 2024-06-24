import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";

const ShowLeaderBoard = ({ otp, userName, setUserRank }) => {
  const { leaderboard } = useUserAuth();
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const data = await leaderboard(otp);
        const sortedData = data.sort((a, b) => b.score - a.score);
        setLeaderboardData(sortedData);
        checkRank(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, [leaderboard]);

  const checkRank = (data) => {
    if (data && Array.isArray(data) && userName) {
      const userEntry = data.find((entry) => entry.username === userName);
      if (userEntry) {
        setUserRank(data.indexOf(userEntry) + 1);
      } else {
        setUserRank(null);
      }
    } else {
      setUserRank(null);
    }
  };

  return (
    <main className="flex h-screen items-center justify-start w-full flex-col overflow-hidden bg-bgBlue">
      <div className="w-full max-w-md p-4">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Leaderboard
        </h1>
        <div id="leaderboard" className="space-y-2">
          {leaderboardData ? (
            leaderboardData.map((entry, index) => (
              <div
                key={index}
                className={`mb-2 flex transform items-center justify-between rounded-md bg-white bg-opacity-10 p-4 text-white font-bold transition duration-200 ease-in-out hover:-translate-y-1 ${
                  entry.username === userName
                    ? "border-2 border-yellow-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>#{index + 1}</span>

                  <span className="">{entry.username}</span>
                </div>
                <span>{entry.score} points</span>
              </div>
            ))
          ) : (
            <p>Loading leaderboard...</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ShowLeaderBoard;
