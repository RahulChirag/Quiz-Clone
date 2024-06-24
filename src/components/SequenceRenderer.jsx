import React, { useState, useEffect } from "react";
import {
  ShowQuestionOnly,
  PlayMcqGame,
  ShowLeaderBoard,
  EndLeaderBoard,
} from "../components/Components";
import { useParams } from "react-router-dom";

const Game = ({ elements, userName, gameTitle }) => {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [userRank, setUserRank] = useState(null);
  const { otp } = useParams();

  const components = [
    {
      Component: () => (
        <ShowQuestionOnly
          question={elements[currentElementIndex]}
          time={5}
          handleSkip={handleSkip}
          index={currentElementIndex}
          length={elements.length}
          userRank={userRank}
        />
      ),
      duration: 5700,
    },
    {
      Component: () => (
        <PlayMcqGame
          question={elements[currentElementIndex]}
          duration={20}
          handleSkip={handleSkip}
          userName={userName}
          index={currentElementIndex}
          length={elements.length}
          userRank={userRank}
          gameTitle={gameTitle}
        />
      ),
      duration: 200000000,
    },
    {
      Component: () => (
        <ShowLeaderBoard
          otp={otp}
          userName={userName}
          setUserRank={setUserRank}
        />
      ),
      duration: 2000,
    },
  ];

  useEffect(() => {
    if (currentComponentIndex < components.length) {
      const interval = setInterval(() => {
        setCurrentComponentIndex((prevIndex) => prevIndex + 1);
      }, components[currentComponentIndex].duration);

      return () => clearInterval(interval);
    } else {
      setCurrentComponentIndex(0);
      setCurrentElementIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentComponentIndex]);

  const handleSkip = () => {
    setCurrentComponentIndex((prevIndex) => prevIndex + 1);
  };

  const renderComponent = () => {
    if (currentComponentIndex < components.length) {
      const { Component } = components[currentComponentIndex];
      return <Component />;
    }
    return null;
  };

  return (
    <div>
      {currentElementIndex < elements.length ? (
        <div>
          <div>{renderComponent()}</div>
        </div>
      ) : (
        <>
          <EndLeaderBoard otp={otp} userName={userName} />
        </>
      )}
    </div>
  );
};

export default Game;
