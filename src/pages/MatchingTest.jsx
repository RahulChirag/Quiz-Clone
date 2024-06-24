import React, { useState, useRef, useEffect } from "react";

const data = [
  { state: "Maharashtra", capital: "Mumbai" },
  { state: "Punjab", capital: "Chandigarh" },
  { state: "Karnataka", capital: "Bengaluru" },
  { state: "Himachal Pradesh", capital: "Shimla" },
  { state: "Rajasthan", capital: "Jaipur" },
];

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const drawLine = (startElem, endElem, container) => {
  const start = startElem.getBoundingClientRect();
  const end = endElem.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const startX = start.right - containerRect.left;
  const startY = start.top + start.height / 2 - containerRect.top;
  const endX = end.left - containerRect.left;
  const endY = end.top + end.height / 2 - containerRect.top;

  return `M${startX},${startY} C${startX + 50},${startY} ${
    endX - 50
  },${endY} ${endX},${endY}`;
};

const MatchTheFollowingGame = () => {
  const [states, setStates] = useState([]);
  const [capitals, setCapitals] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCapital, setSelectedCapital] = useState(null);
  const svgContainerRef = useRef();
  const [lines, setLines] = useState([]);

  useEffect(() => {
    setStates(shuffleArray(data.map((item) => item.state)));
    setCapitals(shuffleArray(data.map((item) => item.capital)));
  }, []);

  useEffect(() => {
    if (selectedState && selectedCapital) {
      const stateObj = data.find((item) => item.state === selectedState);
      const isCorrect = stateObj && stateObj.capital === selectedCapital;
      const stateElem = document.querySelector(
        `[data-state="${selectedState}"]`
      );
      const capitalElem = document.querySelector(
        `[data-capital="${selectedCapital}"]`
      );

      if (stateElem && capitalElem) {
        if (isCorrect) {
          // Correct match: draw line and highlight in green
          const newLine = drawLine(
            stateElem,
            capitalElem,
            svgContainerRef.current
          );
          setLines((prevLines) => [
            ...prevLines,
            { path: newLine, color: "green" },
          ]);
          stateElem.classList.add("bg-green-200");
          capitalElem.classList.add("bg-green-200");
        } else {
          // Incorrect match: highlight in reds
          setTimeout(() => {
            stateElem.classList.remove("bg-red-200");
            capitalElem.classList.remove("bg-red-200");
          }, 1000); // Highlight red for 1 second
        }
      }

      // Reset selection
      setTimeout(() => {
        setSelectedState(null);
        setSelectedCapital(null);
      }, 1000);
    }
  }, [selectedState, selectedCapital]);

  const handleStateClick = (state) => {
    setSelectedState(state);
  };

  const handleCapitalClick = (capital) => {
    setSelectedCapital(capital);
  };

  return (
    <div className="relative p-4 flex justify-center items-start space-x-32">
      <div>
        <h2 className="text-xl font-bold mb-2">States</h2>
        <ul className="bg-gray-200 p-4 rounded-lg shadow-md space-y-4">
          {states.map((state, index) => (
            <li
              key={index}
              data-state={state}
              onClick={() => handleStateClick(state)}
              className={`p-2 bg-white rounded-lg shadow-md cursor-pointer transition-colors duration-300 ${
                selectedState === state ? "bg-blue-100" : ""
              }`}
            >
              {state}
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={svgContainerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <svg className="w-full h-full">
          {lines.map((line, index) => (
            <path
              key={index}
              d={line.path}
              stroke={line.color}
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Capitals</h2>
        <ul className="bg-gray-200 p-4 rounded-lg shadow-md space-y-4">
          {capitals.map((capital, index) => (
            <li
              key={index}
              data-capital={capital}
              onClick={() => handleCapitalClick(capital)}
              className={`p-2 bg-white rounded-lg shadow-md cursor-pointer transition-colors duration-300 ${
                selectedCapital === capital ? "bg-blue-100" : ""
              }`}
            >
              {capital}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchTheFollowingGame;
