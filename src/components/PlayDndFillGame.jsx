import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useScore } from "../context/ScoreContext";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const PlayDndFillGame = ({ question, duration, handleSkip, userName }) => {
  const { otp } = useParams();
  const { setScore } = useUserAuth();
  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);
  const { score, updateScore } = useScore();
  const [blanks, setBlanks] = useState([]);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [allBlanksFilled, setAllBlanksFilled] = useState(false); // State to track if all blanks are filled

  const saveScoreToFirebase = () => {
    if (userName) {
      setScore(userName, score, otp);
    }
  };

  // Initialize game state on question or duration change
  useEffect(() => {
    if (question) {
      const numberOfBlanks = question.question.split("*").length - 1;
      setBlanks(new Array(numberOfBlanks).fill(""));
      setOptions([...question.options]);
      setFeedback(new Array(numberOfBlanks).fill(null));
    }
  }, [question]);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !allBlanksFilled) {
      const countdown = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
        setProgress((prevProgress) => prevProgress - 100 / duration);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, duration, allBlanksFilled]);

  // Check if all blanks are filled
  const isAllBlanksFilled = useCallback(() => {
    return blanks.every((blank) => blank.trim() !== "");
  }, [blanks]);

  // Handle dropping an option into a blank
  const handleDrop = (option, index) => {
    setBlanks((prevBlanks) => {
      const newBlanks = [...prevBlanks];
      const previousOption = newBlanks[index];

      // Replace option in blanks and remove from options
      newBlanks[index] = option;
      setOptions((prevOptions) => prevOptions.filter((opt) => opt !== option));

      // Return previous option back to options if it exists
      if (previousOption) {
        setOptions((prevOptions) => [...prevOptions, previousOption]);
      }

      // Check if all blanks are filled
      if (newBlanks.every((blank) => blank.trim() !== "")) {
        setAllBlanksFilled(true);
      } else {
        setAllBlanksFilled(false);
      }

      return newBlanks;
    });
  };

  // Check if all blanks are filled and provide feedback
  useEffect(() => {
    if (blanks.length > 0 && isAllBlanksFilled()) {
      console.log("All blanks are filled");
      handleFeedback();
      // Handle completion (update score, etc.)
    }
  }, [blanks, isAllBlanksFilled]);

  // Handle giving feedback on filled blanks
  const handleFeedback = () => {
    let scoreIncrement = 0;

    const newFeedback = blanks.map((blank, index) => {
      if (blank.trim() === question.correctAnswers[index]) {
        scoreIncrement++;
        return true; // Correct answer
      } else {
        return false; // Incorrect answer
      }
    });
    if (scoreIncrement > 0) {
      updateScore(scoreIncrement);
    }
    setFeedback(newFeedback);
  };

  // Render the question with blanks
  const renderQuestion = (text) => {
    if (!text) return null;

    const parts = text.split("*");
    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && <Blank index={index} />}
      </React.Fragment>
    ));
  };

  // Render the available options
  const renderOptions = (options) => {
    if (!options) return null;

    return options.map((option, index) =>
      allBlanksFilled ? (
        <Option key={index} option={option} draggable={false} />
      ) : (
        <Option key={index} option={option} />
      )
    );
  };

  // Blank component
  const Blank = ({ index }) => {
    const [{ canDrop, isOver }, drop] = useDrop({
      accept: "OPTION",
      drop: (item) => handleDrop(item.option, index),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    });

    const isActive = canDrop && isOver;
    let baseClass =
      "flex items-center justify-center p-2 border-2 border-dashed m-2 rounded text-center w-24 h-10";
    if (feedback[index] === true) {
      baseClass += " bg-green-100"; // Correct feedback
    } else if (feedback[index] === false) {
      baseClass += " bg-red-100"; // Incorrect feedback
    } else if (isActive) {
      baseClass += " bg-green-50"; // Active drop zone
    } else {
      baseClass += " bg-gray-100"; // Default
    }

    return (
      <span ref={drop} className={baseClass}>
        {blanks[index] || "_____"}
      </span>
    );
  };

  // Option component
  const Option = ({ option, draggable = true }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "OPTION",
      item: { option },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const baseClass =
      "flex items-center justify-center p-2 border rounded cursor-move m-2 bg-blue-200 text-blue-800 w-24 h-10";
    const dragClass = isDragging ? "opacity-50" : "opacity-100";

    return draggable ? (
      <span ref={drag} className={`${baseClass} ${dragClass}`}>
        {option}
      </span>
    ) : (
      <span className={`${baseClass} ${dragClass}`}>{option}</span>
    );
  };

  const handleNext = () => {
    handleSkip();
    saveScoreToFirebase();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex max-h-screen w-full flex-col items-center justify-center bg-slate-600 p-1">
        <header className="flex w-full flex-col bg-slate-200 p-1">
          <div className="flex items-center bg-green-400 p-2">
            <span className="text-3xl font-semibold">{timer}s</span>
            <span className="ml-auto text-3xl font-semibold">
              Score: {score}
            </span>
          </div>
          <div className="h-1/2 bg-green-200 p-2">
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
              <div
                className="h-full bg-rose-600 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>
        <section className="flex flex-col bg-slate-200 p-1 w-full">
          <div className="flex items-center justify-center h-52 mb-3 overflow-hidden md:h-72 lg:h-96">
            {renderQuestion(question?.question)}
          </div>
          <div className="flex flex-wrap justify-center">
            {renderOptions(options)}
          </div>
          <button onClick={handleNext}>Next</button>
        </section>
      </main>
    </DndProvider>
  );
};

export default PlayDndFillGame;
