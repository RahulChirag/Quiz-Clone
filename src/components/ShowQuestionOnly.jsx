import React, { useState, useEffect } from "react";
import Medal from "../assets/Medal.png";
import AudioOn from "../assets/AudioToggleOn.png";

const ShowQuestionOnly = ({
  question,
  time,
  handleSkip,
  length,
  index,
  userRank,
}) => {
  const [progress, setProgress] = useState(100);

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

  const getOrdinalSuffix = (rank) => {
    if (rank === 1) return "st";
    else if (rank === 2) return "nd";
    else if (rank === 3) return "rd";
    else return "th";
  };
  return (
    <main className="flex h-screen w-full flex-col overflow-hidden bg-bgBlue">
      {/* Fixed Progress Bar at the Top */}
      <header className="flex items-center justify-between bg-headerBlue p-4">
        <div className="flex min-w-28 justify-center rounded-md bg-bgBlue p-2 ml-3">
          <span className="text-center text-2xl font-bold text-white">
            <span className="text-sm text-option">Question</span>
            <br />
            <span className="text-lg text-option font-bold">
              {index + 1} of {length}
            </span>
          </span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <img src={Medal} alt="Medal" className="h-10 w-10 object-cover" />
            {userRank === null ? (
              <span className="text-xl font-bold text-white">__</span>
            ) : (
              <span className="text-xl font-bold text-white">
                {userRank}
                {getOrdinalSuffix(userRank)}
              </span>
            )}
          </div>
          <button className="h-10 w-10 rounded-full bg-bgBlue p-1 hover:bg-blue-600 transition-colors">
            <img
              src={AudioOn}
              className="h-full w-full rounded-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-300">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
          style={{
            width: `${progress}%`,
            transition: "width 0.1s linear", // Use 100ms (0.1s) directly here for the interval duration
          }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        {/* Question */}
        <div className="flex items-center justify-center mb-4">
          <p className=" text-xl md:text-3xl lg:text-5xl font-extrabold text-white text-center leading-relaxed">
            {question.question}
          </p>
        </div>
      </div>
      <div className=" h-20 w-full flex items-center justify-center bg-black">
        <button
          onClick={handleSkip}
          className="rounded-lg bg-check p-2 text-center font-montserrat text-xl text-white ml-auto mr-9"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default ShowQuestionOnly;
