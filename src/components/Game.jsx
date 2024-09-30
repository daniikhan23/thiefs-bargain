import React, { useState, useEffect } from "react";

const Game = () => {
  const [gameState, setGameState] = useState("start");
  const [score, setScore] = useState(0);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
  };

  const endGame = () => {
    setGameState("finished");
    const finalScore = score;
    setScore(0);

    return finalScore;
  };

  return (
    <>
      <div className="bg-black w-[60vw] h-[60vh] text-center rounded-lg">
        <div className="main h-[90%]">
          {gameState === "start" && (
            <div className="flex flex-col justify-center items-center mb-5 gap-5">
              <h1 className="text-white text-3xl font-bold underline">
                Welcome to A Thief's Escape
              </h1>
              <p className="text-white text-lg">↑ to jump and ↓ to duck</p>
              <button
                onClick={startGame}
                className="text-black font-bold text-lg bg-white p-2 rounded-md hover:bg-red-700"
              >
                Start Game
              </button>
            </div>
          )}
          {gameState === "finished" && (
            <div className="text-center z-50 text-white">
              <h2 className="text-3xl mb-4 font-bold ">Game Over!</h2>
              <p className="text-2xl">Score: {score}</p>
            </div>
          )}
        </div>
        <div className="border divide-x"></div>
      </div>
      {gameState === "playing" && (
        <button
          onClick={endGame}
          className="text-black font-bold text-lg bg-white p-2 rounded-md hover:bg-red-700 mt-5"
        >
          End Game
        </button>
      )}
      {gameState === "finished" && (
        <div className="text-center">
          <button
            onClick={startGame}
            className="text-black font-bold text-lg bg-white p-2 rounded-md hover:bg-red-700 mt-5"
          >
            Restart Game
          </button>
        </div>
      )}
    </>
  );
};

export default Game;
