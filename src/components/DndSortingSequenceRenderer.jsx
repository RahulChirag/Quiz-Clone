import React, { useState, useEffect } from "react";
import {
  ShowQuestionOnly,
  PlayDndSorting,
  ShowLeaderBoard,
} from "../components/Components";
import { useParams } from "react-router-dom";

const DndSortingSequenceRenderer = ({ elements, userName }) => {
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const { otp } = useParams();

  const components = [
    {
      Component: () => (
        <ShowQuestionOnly
          question={elements[currentElementIndex]}
          time={5}
          handleSkip={handleSkip}
        />
      ),
      duration: 2000000,
    },
    {
      Component: () => (
        <PlayDndSorting
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

export default DndSortingSequenceRenderer;
