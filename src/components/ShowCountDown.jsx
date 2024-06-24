import React, { useState, useEffect } from "react";

const ShowCountDown = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const countdown = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [count]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="font-extrabold text-8xl text-white drop-shadow-lg">
        {count === 0 ? (
          <span className="animate-bounce text-9xl drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]">
            Go!
          </span>
        ) : (
          <span className="animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
            {count}
          </span>
        )}
      </div>
    </div>
  );
};

export default ShowCountDown;
