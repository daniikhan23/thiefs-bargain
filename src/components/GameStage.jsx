import React, { useEffect, useState } from "react";
import { Container, useApp } from "@pixi/react";
import Player from "./Player";
import ScoreDisplay from "./ScoreDisplay";
import Background from "./Background";
import Obstacle from "./Obstacle";

const SCROLL_SPEED = 5;
const MIN_OBSTACLE_DISTANCE = 300;
const MAX_OBSTACLE_DISTANCE = 600;
const MIN_ARROW_HEIGHT = 10;
const MAX_ARROW_HEIGHT = 150;

const GameStage = ({ gameState, score, setScore }) => {
  const app = useApp();
  const [obstacles, setObstacles] = useState([]);
  const [nextObstacleDistance, setNextObstacleDistance] = useState(0);

  const generateRandomDistance = () => {
    return (
      MIN_OBSTACLE_DISTANCE +
      Math.random() * (MAX_OBSTACLE_DISTANCE - MIN_OBSTACLE_DISTANCE)
    );
  };

  const generateObstacle = () => {
    // Randomly choose obstacle type
    const obstacleTypes = ["ARROW", "SPIKE", "ENEMY"];
    const randomType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    let height = 0;

    // Only arrows need random height
    if (randomType === "ARROW") {
      height =
        MIN_ARROW_HEIGHT +
        Math.random() * (MAX_ARROW_HEIGHT - MIN_ARROW_HEIGHT);
    }

    return {
      id: Date.now(),
      x: app.screen.width,
      height,
      type: randomType,
    };
  };

  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = (delta) => {
        setObstacles((currentObstacles) => {
          let updatedObstacles = currentObstacles
            .map((obstacle) => ({
              ...obstacle,
              x: obstacle.x - SCROLL_SPEED * delta,
            }))
            .filter((obstacle) => obstacle.x > -100);

          setNextObstacleDistance((prev) => prev - SCROLL_SPEED * delta);

          if (nextObstacleDistance <= 0) {
            const newObstacle = generateObstacle();
            updatedObstacles = [...updatedObstacles, newObstacle];
            setNextObstacleDistance(generateRandomDistance());
          }

          return updatedObstacles;
        });

        setScore((prevScore) => prevScore + delta * 0.1);
      };

      app.ticker.add(gameLoop);
      return () => app.ticker.remove(gameLoop);
    }
  }, [gameState, app.ticker, setScore, app.screen.width, nextObstacleDistance]);

  return (
    <Container>
      <Background />
      <Player position={{ x: 150, y: 365 }} />
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} {...obstacle} />
      ))}
      <ScoreDisplay score={Math.floor(score)} />
    </Container>
  );
};

export default GameStage;
