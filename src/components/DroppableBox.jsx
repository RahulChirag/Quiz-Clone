// DroppableBox.js
import React from "react";
import { useDrop } from "react-dnd";

const DroppableBox = ({ index, onDrop, contents }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "OPTION",
    drop: (item) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className="p-4 border-2 border-dashed h-32 w-32 flex items-center justify-center"
      style={{
        backgroundColor: isActive ? "lightgreen" : "white",
      }}
    >
      {contents === null ? (
        "Drag item here"
      ) : contents.string ? (
        <div className="text-xl">{contents.string}</div>
      ) : (
        <img
          src={contents.image}
          alt={`Option ${contents.id}`}
          className="h-24 w-24"
        />
      )}
    </div>
  );
};

export default DroppableBox;
