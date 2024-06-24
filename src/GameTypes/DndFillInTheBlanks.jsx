import React, { useEffect, useState } from "react";
import {
  Loading,
  ShowGameTitle,
  ShowCountDown,
  DndFillSequenceRenderer,
} from "../components/Components";

const DndFillInTheBlanks = ({ gameData, userName }) => {
  const gameName = gameData.GameName;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startGameSequence, setStartGameSequence] = useState(false);
  const [showGameTitle, setShowGameTitle] = useState(true);
  const [showCountDown, setShowCountDown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/games/${gameName}.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch game data");
        }
        const gameData = await response.json();
        setData(gameData);
        setTimeout(() => {
          setShowGameTitle(false);
          setShowCountDown(true);
          setTimeout(() => {
            setShowCountDown(false);
            setStartGameSequence(true);
          }, 4000);
        }, 2000);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [gameName]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {showGameTitle && <ShowGameTitle gameTitle={data.gameTitle} />}
      {showCountDown && <ShowCountDown />}
      {startGameSequence && (
        <DndFillSequenceRenderer
          elements={data.questions}
          userName={userName}
        />
      )}
    </div>
  );
};

export default DndFillInTheBlanks;
