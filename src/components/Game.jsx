import React from "react";
import {
  MCQ,
  DndFillInTheBlanks,
  DndSequence,
  DndPictures,
  DndSorting,
  SpellGame,
} from "../GameTypes/Types";
import { ScoreProvider } from "../context/ScoreContext";

const Game = ({ gameData, userName }) => {
  const renderGameComponent = () => {
    switch (gameData.GameType) {
      case "MCQ":
        return (
          <ScoreProvider>
            <MCQ gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      case "Fill in the blanks":
        return (
          <ScoreProvider>
            <DndFillInTheBlanks gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      case "Sequence":
        return (
          <ScoreProvider>
            <DndSequence gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      case "Pictures":
        return (
          <ScoreProvider>
            <DndPictures gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      case "Sorting":
        return (
          <ScoreProvider>
            <DndSorting gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      case "SpellGame":
        return (
          <ScoreProvider>
            <SpellGame gameData={gameData} userName={userName} />
          </ScoreProvider>
        );
      default:
        return <p>Unknown Game Type</p>;
    }
  };

  return <div>{renderGameComponent()}</div>;
};

export default Game;
