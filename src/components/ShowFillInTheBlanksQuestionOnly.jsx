import React, { useState, useEffect } from "react";

const ShowFillInTheBlanksQuestionOnly = ({ question, time, handleSkip }) => {
  const [progress, setProgress] = useState(100);
  const blank = "______";

  const processQuestion = (text) => {
    // Use a regular expression to replace each `*` with the blank
    return text.replace(/\*/g, blank);
  };

  useEffect(() => {
    const totalDuration = time * 1000; // Convert duration to milliseconds
    const intervalDuration = 100; // Interval duration in milliseconds
    const decrementAmount = (100 / totalDuration) * intervalDuration; // Amount to decrement per interval

    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        Math.max(0, prevProgress - decrementAmount)
      );
    }, intervalDuration);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [time]);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-4">
      {/* Fixed Progress Bar at the Top */}
      <div className="fixed top-0 left-0 w-full h-4 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
          style={{
            width: `${progress}%`,
            transition: "width 100ms linear", // Use 100ms directly here for the interval duration
          }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>
      {/* Main Content Container */}
      <div className="relative w-full bg-white p-8 shadow-2xl rounded-xl mt-16">
        {/* Question */}
        <div className="flex items-center justify-center">
          <p className="text-3xl font-extrabold text-gray-800 text-center leading-relaxed">
            {processQuestion(question.question)}
          </p>
          <button onClick={handleSkip}>Next</button>
        </div>
      </div>
    </main>
  );
};

export default ShowFillInTheBlanksQuestionOnly;
