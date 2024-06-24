import React, { useState, useEffect } from "react";
import { useScore } from "../context/ScoreContext";
import { useUserAuth } from "../context/FirebaseAuthContext";
import { useParams } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = {
  ITEM: "item",
};

const DraggableItem = ({ item, index, moveItem }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType.ITEM,
    item: { index, item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`m-2 p-2 border rounded ${isDragging ? "opacity-50" : ""}`}
      style={{ cursor: "move" }}
    >
      {item.image ? (
        <img src={item.image} alt="" className="w-16 h-16" />
      ) : (
        <span>{item.string}</span>
      )}
    </div>
  );
};

const DroppableBox = ({ index, item, moveItem, isCorrect }) => {
  const [, dropRef] = useDrop({
    accept: ItemType.ITEM,
    drop: (draggedItem) => moveItem(draggedItem.index, index),
  });

  return (
    <div
      ref={dropRef}
      className={`m-2 p-2 border rounded w-16 h-16 ${
        isCorrect === true
          ? "bg-green-400"
          : isCorrect === false
          ? "bg-red-400"
          : ""
      }`}
    >
      {item && <DraggableItem item={item} index={index} moveItem={moveItem} />}
    </div>
  );
};

const PlayDndSequence = ({ question, duration }) => {
  const { setScore } = useUserAuth();
  const { score, updateScore } = useScore();
  const { otp } = useParams();

  const [timer, setTimer] = useState(duration);
  const [progress, setProgress] = useState(100);

  const [sequenceItems, setSequenceItems] = useState([]);
  const [correctSequence, setCorrectSequence] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [boxCorrectness, setBoxCorrectness] = useState([]);

  useEffect(() => {
    if (question) {
      let correctSeq;
      if (question.ImageSequence) {
        correctSeq = question.ImageSequence.map((item, index) => ({
          ...item,
          correctIndex: index,
        }));
      } else if (question.StringSequence) {
        correctSeq = question.StringSequence.map((item, index) => ({
          ...item,
          correctIndex: index,
        }));
      }

      const shuffledItems = shuffleArray([...correctSeq]);
      setSequenceItems(shuffledItems);
      setCorrectSequence(correctSeq);
      setBoxes(Array(correctSeq.length).fill(null));
      setBoxCorrectness(Array(correctSeq.length).fill(null));
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

  const handleCheck = () => {
    const newBoxCorrectness = boxes.map((box, index) => {
      if (box && box.correctIndex === index) {
        return true;
      }
      return false;
    });
    setBoxCorrectness(newBoxCorrectness);
  };

  const shuffleArray = (array) => {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const moveItem = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;

    let newSequenceItems = [...sequenceItems];
    let newBoxes = [...boxes];

    if (fromIndex < sequenceItems.length && toIndex < sequenceItems.length) {
      // Moving item within sequence items
      const [movedItem] = newSequenceItems.splice(fromIndex, 1);
      newSequenceItems.splice(toIndex, 0, movedItem);
    } else if (
      fromIndex >= sequenceItems.length &&
      toIndex >= sequenceItems.length
    ) {
      // Moving item within boxes
      const fromBoxIndex = fromIndex - sequenceItems.length;
      const toBoxIndex = toIndex - sequenceItems.length;

      const movedItem = newBoxes[fromBoxIndex];
      newBoxes[fromBoxIndex] = newBoxes[toBoxIndex];
      newBoxes[toBoxIndex] = movedItem;
    } else if (
      fromIndex < sequenceItems.length &&
      toIndex >= sequenceItems.length
    ) {
      // Moving item from sequence items to a box
      const [movedItem] = newSequenceItems.splice(fromIndex, 1);
      const boxIndex = toIndex - sequenceItems.length;
      if (newBoxes[boxIndex]) {
        // Swap between sequence items and boxes
        const temp = newBoxes[boxIndex];
        newBoxes[boxIndex] = movedItem;
        newSequenceItems.push(temp);
      } else {
        // Place into empty box
        newBoxes[boxIndex] = movedItem;
      }
    } else if (
      fromIndex >= sequenceItems.length &&
      toIndex < sequenceItems.length
    ) {
      // Moving item from a box to sequence items
      const boxIndex = fromIndex - sequenceItems.length;
      const movedItem = newBoxes[boxIndex];
      newBoxes[boxIndex] = null;
      newSequenceItems.splice(toIndex, 0, movedItem);
    }

    setSequenceItems(newSequenceItems);
    setBoxes(newBoxes);
    setBoxCorrectness(Array(newBoxes.length).fill(null));
  };

  const renderSequenceItems = (items) => {
    if (!items) return null;

    return items.map((item, index) => (
      <DraggableItem
        key={item.id}
        item={item}
        index={index}
        moveItem={moveItem}
      />
    ));
  };

  const renderBoxes = (boxes) => {
    if (!boxes) return null;

    return boxes.map((box, index) => (
      <DroppableBox
        key={index}
        index={index + sequenceItems.length}
        item={box}
        moveItem={moveItem}
        isCorrect={boxCorrectness[index]}
      />
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex max-h-screen w-full flex-col items-center justify-center bg-slate-600 p-4">
        <header className="flex w-full flex-col bg-slate-200 p-4 rounded-lg mb-4">
          <div className="flex items-center bg-green-400 p-4 rounded-md mb-2">
            <span className="text-3xl font-semibold">{timer}s</span>
            <span className="ml-auto text-3xl font-semibold">
              Score: {score}
            </span>
          </div>
          <div className="bg-green-200 p-2 rounded-md shadow-inner">
            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-rose-600 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </header>
        <div className="flex flex-wrap justify-center">
          {renderSequenceItems(sequenceItems)}
        </div>
        <div className="flex flex-wrap justify-center">
          {renderBoxes(boxes)}
        </div>

        <button
          className="mt-6 p-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700"
          onClick={handleCheck}
        >
          Check
        </button>
      </main>
    </DndProvider>
  );
};

export default PlayDndSequence;
