import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useScore } from "../context/ScoreContext";
import { useUserAuth } from "../context/FirebaseAuthContext";
import Medal from "../assets/Medal.png";
import AudioOn from "../assets/AudioToggleOn.png";

const PlayMcqGame = ({
  question,
  index,
  duration,
  handleSkip,
  userName,
  length,
  userRank,
  gameTitle,
}) => {
  const { otp } = useParams();
  const { setScore } = useUserAuth();
  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);
  const [answer, setAnswer] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [evaluation, setEvaluation] = useState({});
  const { score, updateScore } = useScore();
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [dynamicScoreDisplay, setDynamicScoreDisplay] = useState(null);
  const [saveScoreFlag, setSaveScoreFlag] = useState(false);
  const [randomPrompt, setRandomPrompt] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const saveScoreToFirebase = (currentScore) => {
    if (userName) {
      console.log("Saving score to Firebase", { userName, currentScore, otp });
      setScore(userName, currentScore, otp);
    }
  };

  const generateCorrectPrompts = () => {
    const prompts = [
      "Fantastic job! Keep it up!",
      "You nailed it! Well done!",
      "Brilliant answer! You're on fire!",
      "Great work! Keep going!",
      "Correct! You're doing amazing!",
      "Perfect! You're a star!",
      "Spot on! Excellent work!",
      "You got it right! Awesome!",
      "Well done! Keep the momentum!",
      "That's correct! You're doing great!",
    ];

    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  const generateIncorrectPrompts = () => {
    const prompts = [
      "Almost there! Try again!",
      "Good effort! Keep going!",
      "Don't give up! You can do it!",
      "Nice try! Keep pushing!",
      "You're getting closer! Try again!",
      "Don't worry! Keep trying!",
      "You'll get it next time! Keep going!",
      "Great attempt! Keep practicing!",
      "No problem! You'll get it soon!",
      "Keep at it! You're doing great!",
    ];

    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  useEffect(() => {
    setTimer(duration);
    setProgress(100);
    const currentAnswer = question?.answer || [];
    setAnswer(currentAnswer);
    setSelectedOption([]);
    setEvaluation({});
    setIsEvaluated(false);
    setIsMultipleChoice(currentAnswer.length > 1);
  }, [question, duration]);

  useEffect(() => {
    if (timer > 0 && !isEvaluated) {
      const countdown = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
        setProgress((prevProgress) => prevProgress - 100 / duration);
      }, 1000);

      return () => clearInterval(countdown);
    }
    if (timer === 0 && !isEvaluated) {
      evaluateSelections([]);
      setTimeout(() => {
        handleSkip();
      }, 3000);
    }
  }, [timer, duration, isEvaluated]);

  useEffect(() => {
    if (saveScoreFlag) {
      saveScoreToFirebase(score);
      handleSkip();
      setSaveScoreFlag(false);
    }
  }, [score, saveScoreFlag]);

  const handleSelectOption = (option) => {
    if (isMultipleChoice) {
      const isAlreadySelected = selectedOption.includes(option);
      const newSelections = isAlreadySelected
        ? selectedOption.filter((opt) => opt !== option) // Deselect
        : [...selectedOption, option]; // Select
      setSelectedOption(newSelections);
    } else {
      setSelectedOption([option]);
      evaluateSelections([option]);
    }
  };

  const calculateDynamicScore = (baseScore, remainingTime) => {
    return baseScore * (1 + remainingTime / duration);
  };

  const evaluateSelections = async (selections) => {
    return new Promise((resolve) => {
      if (isEvaluated) return resolve();

      const evaluation = {};
      let allCorrect = true;

      answer.forEach((correctOption) => {
        evaluation[correctOption] = true;
      });

      selections.forEach((option) => {
        const isCorrect = answer.includes(option);
        evaluation[option] = isCorrect;
        if (!isCorrect) {
          allCorrect = false;
        }
      });

      setEvaluation(evaluation);
      setIsEvaluated(true);

      if (allCorrect && selections.length > 0) {
        const dynamicScore = calculateDynamicScore(selections.length, timer);
        updateScore(dynamicScore * 100);
        setDynamicScoreDisplay(dynamicScore * 100);
        setIsCorrect(true);
        setShowCorrectAnswer(false);
        setTimeout(() => {
          setDynamicScoreDisplay(null);
          setIsCorrect(null); // Reset isCorrect state
          setRandomPrompt(""); // Clear the prompt
        }, 3000);
      } else if (!allCorrect) {
        setIsCorrect(false);
        setShowCorrectAnswer(true); // Show correct answer
        setTimeout(() => {
          setIsCorrect(null); // Reset isCorrect state
          setShowCorrectAnswer(false); // Hide correct answer
          setRandomPrompt(""); // Clear the prompt
        }, 3000);
      }

      resolve();
    });
  };

  const handleCheck = async () => {
    await evaluateSelections(selectedOption);
    setTimeout(() => {
      setSaveScoreFlag(true);
    }, 3000); // Ensure score is saved after the prompt disappears
  };

  const handleNext = () => {
    setSaveScoreFlag(true);
  };

  useEffect(() => {
    if (isCorrect === true) {
      setRandomPrompt(generateCorrectPrompts());
    } else if (isCorrect === false) {
      setRandomPrompt(generateIncorrectPrompts());
    }
  }, [dynamicScoreDisplay, isCorrect]);

  const getOrdinalSuffix = (rank) => {
    if (rank === 1) return "st";
    else if (rank === 2) return "nd";
    else if (rank === 3) return "rd";
    else return "th";
  };

  return (
    <>
      <main className="flex h-screen w-full flex-col overflow-hidden bg-bgBlue">
        {isCorrect !== null && (
          <div
            className={`fixed  bottom-0  transform -translate-x-1/2 w-full px-6 py-3  font-bold text-white  shadow-lg animate-slideUpFadeOut pointer-events-none text-center flex items-center text-sm md:text-lg ${
              isCorrect ? "bg-correct" : "bg-wrong"
            }`}
          >
            <span className="grow text-2xl">{randomPrompt}</span>
            {isCorrect && (
              <>
                <div class="relative flex bg-white p-[0.3rem] pr-12 rounded-lg text-correct flex-col items-start shadow-lg">
                  <span class="text-sm">Correct answer</span>
                  <span>+{dynamicScoreDisplay} points</span>
                  <span class=" absolute top-1/2 right-0 flex h-full w-9 items-center justify-center  bg-correct text-white transform -translate-y-1/2 shadow-2xl rounded-r-lg">
                    <svg
                      class="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </span>
                </div>
              </>
            )}
            {!isCorrect && showCorrectAnswer && (
              <>
                <div class="relative flex bg-white p-[1.2rem] pr-12 rounded-lg text-wrong flex-col items-start shadow-lg">
                  <span class="text-sm ">Inorrect answer</span>
                  <span class="absolute top-1/2 right-0 flex h-full w-9 items-center justify-center  bg-wrong text-white transform -translate-y-1/2 shadow-2xl rounded-r-lg">
                    <svg
                      class="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </div>
              </>
            )}
          </div>
        )}
        <header className="flex items-center justify-between bg-headerBlue p-4">
          <div className="flex items-center justify-center flex-row  p-2">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bgBlue text-4xl font-bold text-white">
              {timer}
            </span>
            <div className="flex w-1/2 justify-center rounded-md bg-bgBlue p-1 ml-3">
              <span className="text-center text-2xl font-bold text-white">
                <span className="text-sm text-option">Question</span>
                <br />
                <span className="text-lg text-option font-bold">
                  {index + 1} of {length}
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-grow justify-center">
            <div className="flex w-1/2 justify-center rounded-md bg-bgBlue p-2">
              <span className="text-center text-2xl font-bold text-white">
                {gameTitle}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-2">
              <img
                src={Medal}
                alt="Medal"
                className="h-10 w-10  object-cover"
              />
              {userRank === null ? (
                <span className="text-xl font-bold text-white">__</span>
              ) : (
                <span className="text-xl font-bold text-white">
                  {userRank}
                  {getOrdinalSuffix(userRank)}
                </span>
              )}
            </div>
            <button className="h-10 w-10 rounded-md bg-bgBlue p-1">
              <img
                src={AudioOn}
                className="h-full w-full rounded-full object-cover"
              />
            </button>
          </div>
        </header>

        <section className="flex h-full w-full flex-col items-center justify-between bg-bgBlue">
          {/*-----------------------------------------------Question section-----------------------------------------*/}
          <div className="flex min-h-80 w-full flex-grow flex-col">
            {question?.questionImage ? (
              <div className="flex h-3/4 items-center justify-center">
                <img
                  src={String(question.questionImage[0])}
                  alt="Question Visual"
                  className="max-h-full max-w-full rounded-md object-contain"
                />
                <div className="flex h-1/4 items-center justify-center">
                  <span className="text-center font-montserrat font-bold text-white md:text-2xl lg:text-3xl">
                    {question?.question}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-center font-montserrat font-bold text-white md:text-2xl lg:text-3xl">
                  {question?.question}
                </span>
              </div>
            )}
          </div>

          {/*-----------------------------------------------Option section-----------------------------------------*/}

          <div className="my-2 grid h-full w-full grid-cols-2 gap-1 lg:flex">
            {question?.options?.map((option, idx) => (
              <div
                key={`Option-${idx}`}
                onClick={() => handleSelectOption(option)}
                className={`flex w-full flex-col items-center justify-center rounded-md cursor-pointer ${
                  evaluation[option] !== undefined
                    ? evaluation[option]
                      ? "bg-correct text-white"
                      : "bg-wrong text-white"
                    : selectedOption.includes(option)
                    ? !isEvaluated
                      ? "bg-optionSelected text-white transform transition duration-300 ease-in-out scale-96 bg-opacity-50 "
                      : "bg-option text-white transform transition duration-100 ease-in-out hover:scale-98"
                    : isEvaluated
                    ? "bg-option bg-opacity-0 "
                    : "bg-option text-black transform transition duration-100 ease-in-out hover:scale-98 "
                }`}
                disabled={isEvaluated && !isMultipleChoice}
              >
                {question.optionImages && question.optionImages[idx] && (
                  <img
                    src={question.optionImages[idx]}
                    alt={`Option ${idx}`}
                    className="mb-2 max-h-40 max-w-full object-contain"
                  />
                )}
                <span
                  className={`text-xl font-bold  ${
                    evaluation[option] !== undefined
                      ? evaluation[option]
                        ? " text-white"
                        : " text-white"
                      : selectedOption.includes(option)
                      ? !isEvaluated
                        ? " text-white"
                        : " text-white"
                      : isEvaluated
                      ? " text-white opacity-0 "
                      : " text-white "
                  }`}
                >
                  {option}
                </span>
              </div>
            ))}
          </div>
          <div className="h-40 w-full flex items-center justify-center  bg-black">
            {isMultipleChoice ? (
              <button
                onClick={handleCheck}
                className="rounded-lg bg-check p-2 text-center font-montserrat text-xl text-white ml-auto mr-9"
                disabled={isEvaluated}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-lg bg-check p-2 text-center font-montserrat text-xl text-white ml-auto mr-9"
              >
                Next
              </button>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default PlayMcqGame;
