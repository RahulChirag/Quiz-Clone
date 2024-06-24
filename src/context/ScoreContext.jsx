import React, { createContext, useContext, useState } from "react";

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [score, setScore] = useState(0);

  const updateScore = (increment) => {
    setScore((prevScore) => {
      const newScore = prevScore + increment;

      return newScore;
    });
  };

  return (
    <ScoreContext.Provider value={{ score, updateScore }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => useContext(ScoreContext);
