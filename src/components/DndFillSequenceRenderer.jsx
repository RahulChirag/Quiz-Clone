import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ShowLeaderBoard,
  ShowFillInTheBlanksQuestionOnly,
  PlayDndFillGame,
} from "../components/Components";

const DndFillSequenceRenderer = ({ elements, userName }) => {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const { otp } = useParams();

  const components = [
    {
      Component: () => (
        <ShowFillInTheBlanksQuestionOnly
          question={elements[currentElementIndex]}
          time={5}
          handleSkip={handleSkip}
        />
      ),
      duration: 2000000,
    },
    {
      Component: () => (
        <PlayDndFillGame
          question={elements[currentElementIndex]}
          duration={20}
          handleSkip={handleSkip}
          userName={userName}
        />
      ),
      duration: 2000000,
    },
    { Component: () => <ShowLeaderBoard otp={otp} />, duration: 2000 },
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
          <p>Game Over</p>
          <ShowLeaderBoard otp={otp} />
        </>
      )}
    </div>
  );
};

export default DndFillSequenceRenderer;
