// File: src/components/EndLeaderBoard.js

import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/FirebaseAuthContext";

const EndLeaderBoard = ({ otp, userName }) => {
  const { liveLeaderboard } = useUserAuth();
  const [leaderboardData, setLeaderboardData] = useState(null);

  useEffect(() => {
    const unsubscribe = liveLeaderboard(otp, setLeaderboardData);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [otp, liveLeaderboard]);

  // Sort the leaderboard data by score in descending order
  const sortedLeaderboardData = leaderboardData
    ? [...leaderboardData].sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-900">
      <div className="mx-auto w-full max-w-xl p-4">
        <h1 className="mb-8 text-center text-4xl text-white">Leaderboard</h1>
        <div className="mb-8 flex items-end justify-between space-x-4">
          {sortedLeaderboardData.slice(0, 3).map((entry, index) => {
            const isUser = entry.username === userName;
            const bgClass =
              index === 0
                ? "scale-110"
                : index === 1
                ? "scale-105"
                : "scale-100";
            const orderClass =
              index === 0 ? "order-1" : index === 1 ? "order-0" : "order-2";
            return (
              <div
                key={index}
                className={`flex w-1/3 flex-col items-center rounded-lg bg-blue-700 p-4 text-white shadow-md ${bgClass} ${orderClass} ${
                  isUser ? "border-2 border-yellow-500" : ""
                }`}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold">
                  #{index + 1}
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {entry.username}
                </div>
                <div className="text-xl font-bold">{entry.score} points</div>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          {sortedLeaderboardData.slice(3).map((entry, index) => {
            const isUser = entry.username === userName;
            return (
              <div
                key={index + 3}
                className={`flex items-center justify-between rounded-lg p-4 text-white shadow-md ${
                  isUser
                    ? "border-2 border-yellow-500 bg-blue-700"
                    : "bg-blue-700"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                      isUser ? "bg-yellow-500" : "bg-blue-500"
                    } text-2xl font-bold`}
                  >
                    #{index + 4}
                  </div>
                  <div className="text-lg font-semibold">{entry.username}</div>
                </div>
                <div className="text-xl font-bold">{entry.score} points</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EndLeaderBoard;
