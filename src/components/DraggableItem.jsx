// DraggableItem.js
import React from "react";
import { useDrag } from "react-dnd";

const DraggableItem = ({ item, index, isDraggable }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "OPTION",
    item: { ...item, originalIndex: index },
    canDrag: isDraggable,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={isDraggable ? drag : null}
      className="p-2 border-2 border-solid h-24 w-24 flex items-center justify-center"
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDraggable ? "move" : "not-allowed",
      }}
    >
      {item ? (
        item.string ? (
          <div className="text-xl">{item.string}</div>
        ) : (
          <img
            src={item.image}
            alt={`Option ${item.id}`}
            className="h-full w-full"
          />
        )
      ) : null}
    </div>
  );
};

export default DraggableItem;
