import React, { useState, useEffect, useMemo, useRef } from "react";
import { Stage } from "@pixi/react";
import GameStage from "./GameStage";
import logo from "../../public/assets/logo/cowled.png";
import menuImage from "../../public/assets/main-menu/main-menu.png";

const Game = () => {
  const [gameState, setGameState] = useState("start");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [stageSize, setStageSize] = useState({ width: 1, height: 1 });
  const gameContainerRef = useRef(null);

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setHealth(3);
  };

  const endGame = () => {
    setGameState("finished");
    const finalScore = score;
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
        className="w-[60vw] h-[60vh] text-center rounded-lg z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('../../public/assets/main-menu/main-menu.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        ref={gameContainerRef}
      >
        <div className=" w-full h-full flex flex-col justify-center items-center rounded-lg">
          {/* Start Screen */}
          {gameState === "start" && (
            <div className="flex flex-col justify-center items-center gap-5">
              <p className="text-white text-xl font-bold">
                ↑ or space to jump{" "}
              </p>
              <button
                onClick={startGame}
                className="text-white font-bold text-lg bg-purple-800 p-2 rounded-md hover:bg-purple-900"
              >
                Start Game
              </button>
            </div>
          )}

          {/* Game Stage */}
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
                health={health}
                setHealth={setHealth}
                endGame={endGame}
              />
            </Stage>
          )}

          {/* Game Over Screen */}
          {gameState === "finished" && (
            <div className="text-center z-50 text-white mt-5">
              <h2 className="text-3xl mb-4 font-bold ">Game Over!</h2>
              <p className="text-2xl text-black font-bold">
                Score: {Math.floor(score)}
              </p>
              <button
                onClick={startGame}
                className="text-white font-bold text-lg bg-purple-800 p-2 rounded-md hover:bg-purple-900 mt-5"
              >
                Restart Game
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
