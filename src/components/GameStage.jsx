import React, { useEffect } from "react";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import Player from "./Player";
import ScoreDisplay from "./ScoreDisplay";

const GameStage = ({ gameState, score, setScore }) => {
  const app = useApp();

  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = (delta) => {
        // Score Updates
        setScore((prevScore) => prevScore + delta * 0.1);
      };
      app.ticker.add(gameLoop);

      return () => app.ticker.remove(gameLoop);
    }
  }, [gameState, app.ticker, setScore]);

  return (
    <Container>
      {/* Background */}
      <Player />
      {/* Obstacles */}
      <ScoreDisplay score={Math.floor(score)} />
    </Container>
  );
};

export default GameStage;
