import React, { useEffect, useState } from "react";
import { Stage, Container, Sprite, useApp } from "@pixi/react";
import Player from "./Player";
import ScoreDisplay from "./ScoreDisplay";
import Background from "./Background";
import Obstacle from "./Obstacle";

const SCROLL_SPEED = 5;

const GameStage = ({ gameState, score, setScore }) => {
  const app = useApp();
  const [worldPosition, setWorldPosition] = useState(0);
  const [obstacles, setObstacles] = useState([]);

  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = (delta) => {
        // Move World
        setWorldPosition((prevPosition) => prevPosition - SCROLL_SPEED * delta);
        // Score Updates
        setScore((prevScore) => prevScore + delta * 0.1);
      };
      app.ticker.add(gameLoop);

      return () => app.ticker.remove(gameLoop);
    }
  }, [gameState, app.ticker, setScore]);

  return (
    <Container>
      <Background />
      <Player position={{ x: 150, y: 365 }} />
      {obstacles.map((obstacle) => {
        <Obstacle
          key={obstacle.id}
          {...obstacle}
          worldPosition={worldPosition}
        />;
      })}
      <ScoreDisplay score={Math.floor(score)} />
    </Container>
  );
};

export default GameStage;
