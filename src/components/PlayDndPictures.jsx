import React, { useState, useEffect } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useScore } from "../context/ScoreContext";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { useParams } from "react-router-dom";

const PlayDndPictures = ({ question, duration, handleSkip, userName }) => {
  const { otp } = useParams();
  const { setScore } = useUserAuth();

  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);
  const { score, updateScore } = useScore();

  const [options, setOptions] = useState([]);
  const [images, setImages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [placedOptions, setPlacedOptions] = useState(
    Array(question.imageAnswers.length).fill(null)
  );
  const [filledBlanks, setFilledBlanks] = useState(
    Array(question.imageAnswers.length).fill(false)
  );
  const [feedback, setFeedback] = useState(
    Array(question.imageAnswers.length).fill(null)
  );

  const [allBlanksFilled, setAllBlanksFilled] = useState(false);

  const saveScoreToFirebase = () => {
    if (userName) {
      setScore(userName, score, otp);
    }
  };

  useEffect(() => {
    if (question) {
      setAnswers([...question.imageAnswers]);
      setOptions(shuffleArray([...question.imageAnswers]));
      setImages([...question.images]);
    }
  }, [question]);

  useEffect(() => {
    if (timer > 0 && !allBlanksFilled) {
      const countdown = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
        setProgress((prevProgress) => prevProgress - 100 / duration);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, duration, allBlanksFilled]);

  // Shuffle array function
  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleDrop = (option, blankIndex) => {
    // Check if there's already an option placed in the blank
    const prevOption = placedOptions[blankIndex];

    // Place the dropped option into the blank
    const newPlacedOptions = [...placedOptions];
    newPlacedOptions[blankIndex] = option;
    setPlacedOptions(newPlacedOptions);

    // Update options state to remove the dropped option
    setOptions((prevOptions) => prevOptions.filter((opt) => opt !== option));
    3;

    // If there was a previous option in the blank, return it to options
    if (prevOption !== null) {
      setOptions((prevOptions) => [...prevOptions, prevOption]);
    }

    // Update filledBlanks state to mark this blank as filled
    const newFilledBlanks = [...filledBlanks];
    newFilledBlanks[blankIndex] = true;
    setFilledBlanks(newFilledBlanks);

    // Check if all blanks are filled
    if (newFilledBlanks.every((filled) => filled)) {
      setAllBlanksFilled(true);
      handleFeedback(newPlacedOptions);
    }
  };

  // Handle giving feedback on filled blanks
  const handleFeedback = (placedOptions) => {
    let scoreIncrement = 0;

    const newFeedback = placedOptions.map((placedOption, index) => {
      if (placedOption === null) {
        return null; // Blank not filled
      } else if (placedOption === answers[index]) {
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

    console.log("Feedback:", newFeedback); // Debugging: Check feedback after last drop
  };

  const renderImages = (images) => {
    if (!images) return null;

    return images.map((image, index) => (
      <React.Fragment key={index}>
        <img src={image} alt="" className="h-44" />
        <Blank
          index={index}
          onDrop={handleDrop}
          correctAnswer={answers[index]}
          feedback={feedback[index]}
        />
      </React.Fragment>
    ));
  };

  const Blank = ({ index, onDrop, correctAnswer, feedback }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "option",
      drop: (item) => onDrop(item.option, index),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    let baseClass =
      "h-12 w-12 flex items-center justify-center mb-2 mx-1 sm:mx-2 border ";
    if (feedback === true) {
      baseClass += "bg-green-100"; // Correct feedback
    } else if (feedback === false) {
      baseClass += "bg-red-100"; // Incorrect feedback
    } else if (isOver) {
      baseClass += "bg-green-50"; // Active drop zone
    } else {
      baseClass += "bg-white"; // Default
    }

    return (
      <div ref={drop} className={baseClass}>
        {placedOptions[index] ? placedOptions[index] : "____"}
      </div>
    );
  };

  const Option = ({ option, draggable = true }) => {
    const [{ isDragging }, drag] = useDrag({
      type: "option",
      item: { option },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const baseClass = `h-12 w-12 ${
      isDragging ? "opacity-50" : "opacity-100"
    } border mb-2 mx-1 sm:mx-2`;

    return draggable ? (
      <div ref={drag} className={baseClass}>
        {option}
      </div>
    ) : (
      <div className={baseClass}>{option}</div>
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
        <div className="flex flex-wrap">{renderImages(images)}</div>
        <div className="flex flex-wrap">
          {options.map((option, index) => (
            <Option key={index} option={option} />
          ))}
        </div>
        <button onClick={handleNext}>Next</button>
      </main>
    </DndProvider>
  );
};

export default PlayDndPictures;
