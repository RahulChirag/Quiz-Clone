import React, { useState, useEffect } from "react";
import { useScore } from "../context/ScoreContext";

const PlayDndSorting = ({ question, duration, handleSkip, userName }) => {
  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);
  const { score, updateScore } = useScore();

  const [options, setOptions] = useState([]);
  const [baskets, setBaskets] = useState([]);

  useEffect(() => {
    if (question) {
      setOptions(shuffleArray([...question.options]));
      setBaskets(
        question.types.map((type) => ({
          type,
          name: `Basket for ${type}`,
          options: [],
        }))
      );
    }
  }, [question]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
        setProgress((prevProgress) => prevProgress - 100 / duration);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, duration]);

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragStart = (event, option, source = "options") => {
    event.dataTransfer.setData("optionType", option.type);
    event.dataTransfer.setData("optionValue", option.value);
    event.dataTransfer.setData("source", source);
  };

  const handleDrop = (event, targetBasketType) => {
    event.preventDefault();
    const optionType = event.dataTransfer.getData("optionType");
    const optionValue = event.dataTransfer.getData("optionValue");
    const source = event.dataTransfer.getData("source");

    if (source === "options") {
      setOptions((prevOptions) =>
        prevOptions.filter((option) => option.value !== optionValue)
      );
    } else {
      setBaskets((prevBaskets) =>
        prevBaskets.map((basket) => {
          if (basket.type === source) {
            return {
              ...basket,
              options: basket.options.filter(
                (option) => option.value !== optionValue
              ),
            };
          }
          return basket;
        })
      );
    }

    setBaskets((prevBaskets) =>
      prevBaskets.map((basket) => {
        if (basket.type === targetBasketType) {
          return {
            ...basket,
            options: [
              ...basket.options,
              { type: optionType, value: optionValue },
            ],
          };
        }
        return basket;
      })
    );
  };

  const handleCheck = () => {
    setBaskets((prevBaskets) =>
      prevBaskets.map((basket) => ({
        ...basket,
        options: basket.options.map((option) => ({
          ...option,
          correct: option.type === basket.type,
        })),
      }))
    );
  };

  return (
    <main className="flex max-h-screen w-full flex-col items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black p-4">
      <header className="flex w-full flex-col bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex items-center bg-gray-900 p-2 rounded-md">
          <span className="text-3xl font-semibold text-white">{timer}s</span>
          <span className="ml-auto text-3xl font-semibold text-white">
            Score: {score}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-red-500 transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>
      <div className="flex flex-wrap justify-center space-x-4 mt-6">
        {baskets.map((basket, index) => (
          <div
            key={index}
            className="basket droppable p-4 border-2 border-dashed border-gray-500 rounded-lg bg-gray-800 min-h-[150px] max-w-[250px] w-full shadow-lg"
            onDrop={(event) => handleDrop(event, basket.type)}
            onDragOver={handleDragOver}
          >
            <h2 className="text-lg font-bold text-white mb-2">{basket.name}</h2>
            {basket.options.map((option, idx) => (
              <div
                key={idx}
                className="option p-2 mb-2 bg-white border rounded-lg shadow-md"
                draggable
                onDragStart={(event) =>
                  handleDragStart(event, option, basket.type)
                }
                style={{
                  backgroundColor: option.correct
                    ? "lightgreen"
                    : option.correct === false
                    ? "lightcoral"
                    : "transparent",
                }}
              >
                <img
                  src={option.value}
                  alt=""
                  className="w-12 h-12 object-contain"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center space-x-4 mt-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="draggable-option p-2 m-2 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out"
            draggable
            onDragStart={(event) => handleDragStart(event, option)}
          >
            <img
              src={option.value}
              alt=""
              className="w-12 h-12 object-contain"
            />
          </div>
        ))}
      </div>
      <button
        className="p-2 mt-6 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200 ease-in-out"
        onClick={handleCheck}
      >
        Check
      </button>
    </main>
  );
};

export default PlayDndSorting;
