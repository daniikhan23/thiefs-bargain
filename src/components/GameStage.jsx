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

const GameStage = ({ gameState, score, setScore, endGame }) => {
  const app = useApp();
  const [obstacles, setObstacles] = useState([]);
  const [nextObstacleDistance, setNextObstacleDistance] = useState(0);
  const [playerY, setPlayerY] = useState(365); // Initial Y position of the player

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
      id: Date.now() + Math.random(), // Ensure unique ID
      x: app.screen.width,
      height,
      type: randomType,
    };
  };

  const checkCollision = (playerRect, obstacleRect) => {
    return (
      playerRect.x < obstacleRect.x + obstacleRect.width &&
      playerRect.x + playerRect.width > obstacleRect.x &&
      playerRect.y < obstacleRect.y + obstacleRect.height &&
      playerRect.y + playerRect.height > obstacleRect.y
    );
  };

  const getObstacleProps = (type, height) => {
    const OBSTACLE_TYPES = {
      ARROW: {
        width: 48,
        height: 10,
        isGroundObstacle: false,
      },
      SPIKE: {
        width: 48,
        height: 48,
        isGroundObstacle: true,
      },
      ENEMY: {
        width: 40,
        height: 50,
        isGroundObstacle: true,
      },
    };

    const obstacleProps = OBSTACLE_TYPES[type];

    const y = obstacleProps.isGroundObstacle
      ? 400 - obstacleProps.height // Adjust based on your ground level
      : 400 - height; // For flying obstacles

    return {
      ...obstacleProps,
      y,
    };
  };

  useEffect(() => {
    if (gameState === "playing") {
      const playerWidth = 48; // Adjust to actual player width
      const playerHeight = 64; // Adjust to actual player height
      const playerX = 150; // Player's X position

      const gameLoop = (delta) => {
        // Update obstacles
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

        // Update score
        setScore((prevScore) => prevScore + delta * 0.1);

        // Calculate player's bounding box
        const playerBoundingBox = {
          x: playerX - playerWidth / 2,
          y: playerY - playerHeight / 2,
          width: playerWidth,
          height: playerHeight,
        };

        // Check collisions with obstacles
        for (const obstacle of obstacles) {
          const obstacleProps = getObstacleProps(
            obstacle.type,
            obstacle.height
          );
          const obstacleBoundingBox = {
            x: obstacle.x,
            y: obstacleProps.y,
            width: obstacleProps.width,
            height: obstacleProps.height,
          };

          if (checkCollision(playerBoundingBox, obstacleBoundingBox)) {
            endGame();
            break;
          }
        }
      };

      app.ticker.add(gameLoop);
      return () => app.ticker.remove(gameLoop);
    }
  }, [
    gameState,
    app.ticker,
    setScore,
    nextObstacleDistance,
    endGame,
    obstacles,
    playerY, // Include playerY in dependencies
  ]);

  return (
    <Container>
      <Background />
      <Player
        position={{ x: 150, y: 365 }}
        onUpdate={(newY) => setPlayerY(newY)}
      />
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} {...obstacle} />
      ))}
      <ScoreDisplay score={Math.floor(score)} />
    </Container>
  );
};

export default GameStage;
