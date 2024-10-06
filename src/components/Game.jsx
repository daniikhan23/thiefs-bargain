import React, { useState, useEffect, useMemo, useRef } from "react";
import { BlurFilter, TextStyle } from "pixi.js";
import { Stage, Container, Sprite, Text } from "@pixi/react";
import GameStage from "./GameStage";
import beachBg from "../../public/assets/background/beach/png/full_background.png";

const Game = () => {
  const [gameState, setGameState] = useState("start");
  const [score, setScore] = useState(0);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const gameContainerRef = useRef(null);

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

  useEffect(() => {
    const updateStageDimensions = () => {
      if (gameContainerRef.current) {
        setStageSize({
          width: gameContainerRef.current.clientWidth,
          height: gameContainerRef.current.clientHeight,
        });
      }
    };

    updateStageDimensions();
    window.addEventListener("resize", updateStageDimensions);

    return () => window.removeEventListener("resize", updateStageDimensions);
  }, []);

  return (
    <>
      <div
        className="bg-black w-[60vw] h-[60vh] text-center rounded-lg z-0"
        ref={gameContainerRef}
      >
        <div className="main h-[90%] w-[100%]">
          {/* start button */}
          {gameState === "start" && (
            <div className="flex flex-col justify-center items-center mb-5 gap-5">
              <h1 className="text-white text-3xl font-bold underline">
                Welcome to A Thief's Bargain
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

          {/* render game */}
          {gameState === "playing" && (
            <Stage
              options={{ backgroundColor: 0x1099bb }}
              width={stageSize.width}
              height={stageSize.height}
              className="z-25"
            >
              <GameStage
                gameState={gameState}
                score={score}
                setScore={setScore}
                endGame={endGame}
              />
            </Stage>
          )}

          {/* scoreboard  */}
          {gameState === "finished" && (
            <div className="text-center z-50 text-white">
              <h2 className="text-3xl mb-4 font-bold ">Game Over!</h2>
              <p className="text-2xl">Score: {score}</p>
            </div>
          )}
        </div>
      </div>

      {/* temporary endgame button */}
      {gameState === "playing" && (
        <button
          onClick={endGame}
          className="text-black font-bold text-lg bg-white p-2 rounded-md hover:bg-red-700 mt-5"
        >
          End Game
        </button>
      )}

      {/* restart button */}
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
