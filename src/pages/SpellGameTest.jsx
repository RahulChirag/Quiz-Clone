import React, { useRef, useState, useEffect } from "react";
import { useScore } from "../context/ScoreContext";

const PlaySpellGame = ({ question, duration, handleSkip, userName }) => {
  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);
  const { score } = useScore();
  const [word, setWord] = useState("");
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [clickedLetters, setClickedLetters] = useState([]);
  const [gameMessage, setGameMessage] = useState("");
  const gameLettersRef = useRef([]);
  const animationFrameId = useRef(null);

  useEffect(() => {
    if (question) {
      setWord(question.word);
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

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    const initializeLetters = () => {
      const canvas = canvasRef.current;
      return word.split("").map((char) => ({
        char,
        x: Math.random() * (canvas.width - 60) + 30,
        y: Math.random() * (canvas.height - 60) + 30,
        velocityX: Math.random() * 0.5 - 0.25,
        velocityY: Math.random() * 0.5 - 0.25,
        radius: 30,
        fontSize: 40,
      }));
    };

    gameLettersRef.current = initializeLetters();

    const updatePositions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return; // Ensure canvas is available
      const ctx = canvas.getContext("2d");
      if (!ctx) return; // Ensure context is available

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      gameLettersRef.current.forEach((letter) => {
        letter.x += letter.velocityX;
        letter.y += letter.velocityY;

        if (
          letter.x - letter.radius < 0 ||
          letter.x + letter.radius > canvas.width
        ) {
          letter.velocityX = -letter.velocityX;
        }
        if (
          letter.y - letter.radius < 0 ||
          letter.y + letter.radius > canvas.height
        ) {
          letter.velocityY = -letter.velocityY;
        }

        ctx.font = `${letter.fontSize}px Arial`;
        ctx.fillStyle = "black";
        ctx.fillText(
          letter.char,
          letter.x - letter.radius / 2,
          letter.y + letter.radius / 2
        );
      });

      animationFrameId.current = requestAnimationFrame(updatePositions);
    };

    updatePositions();

    const handleCanvasClick = (event) => {
      const canvas = canvasRef.current;
      if (!canvas) return; // Ensure canvas is available
      const ctx = canvas.getContext("2d");
      if (!ctx) return; // Ensure context is available

      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let letterClicked = null;
      gameLettersRef.current.forEach((letter) => {
        const textWidth = ctx.measureText(letter.char).width;
        const textHeight = letter.fontSize;
        const padding = 30;

        const clickableRegion = {
          x: letter.x - textWidth / 2 - padding,
          y: letter.y - textHeight + padding / 2,
          width: textWidth + 2 * padding,
          height: textHeight + padding,
        };

        if (
          mouseX >= clickableRegion.x &&
          mouseX <= clickableRegion.x + clickableRegion.width &&
          mouseY >= clickableRegion.y &&
          mouseY <= clickableRegion.y + clickableRegion.height
        ) {
          letterClicked = letter;
        }
      });

      if (!letterClicked) {
        return;
      }

      setClickedLetters((prevClickedLetters) => {
        const newClickedLetters = [...prevClickedLetters, letterClicked];

        if (letterClicked.char === word[prevClickedLetters.length]) {
          gameLettersRef.current = gameLettersRef.current.filter(
            (letter) => letter !== letterClicked
          );

          if (newClickedLetters.length === word.length) {
            setGameMessage("Congratulations! You completed the word.");
          }
        } else {
          resetGame();
        }

        return newClickedLetters;
      });
    };

    const resetGame = () => {
      gameLettersRef.current = initializeLetters();
      setClickedLetters([]);
      setGameMessage("");
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("click", handleCanvasClick);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current); // Cancel any running animation frame
      }
      canvas.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [word]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 p-6">
      <header className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg shadow-md mb-6">
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
      <div
        ref={containerRef}
        className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
      >
        <canvas
          ref={canvasRef}
          className="border-2 border-black w-full h-full"
        />
        <div className="mt-4 w-full">
          <h2 className="text-lg font-semibold">Clicked Letters:</h2>
          <ul className="list-disc pl-5">
            {clickedLetters.map((letter, index) => (
              <li key={index} className="text-lg">
                {letter.char}
              </li>
            ))}
          </ul>
          {gameMessage && (
            <p className="text-lg font-semibold text-green-600 mt-4">
              {gameMessage}
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default PlaySpellGame;
