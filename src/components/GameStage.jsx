import React, { useEffect, useState } from "react";
import { Container, useApp } from "@pixi/react";
import Player from "./Player";
import ScoreDisplay from "./ScoreDisplay";
import Background from "./Background";
import Obstacle from "./Obstacle";
import HealthDisplay from "./HealthDisplay";

const MAX_SCROLL_SPEED = 10;
const MIN_OBSTACLE_DISTANCE = 200;
const MAX_OBSTACLE_DISTANCE = 500;
const MIN_ARROW_HEIGHT = 10;
const MAX_ARROW_HEIGHT = 150;

const GameStage = ({
  gameState,
  score,
  setScore,
  health,
  setHealth,
  endGame,
}) => {
  const app = useApp();
  const [obstacles, setObstacles] = useState([]);
  const [nextObstacleDistance, setNextObstacleDistance] = useState(0);
  const [playerY, setPlayerY] = useState(365); // Initial Y position of the player
  const [scrollSpeed, setScrollSpeed] = useState(3.5);

  const generateRandomDistance = () => {
    return (
      MIN_OBSTACLE_DISTANCE +
      Math.random() * (MAX_OBSTACLE_DISTANCE - MIN_OBSTACLE_DISTANCE)
    );
  };

  const generateObstacle = () => {
    const obstacleTypes = ["ARROW", "SPIKE", "ARCHER", "GUARD", "BEARD"];
    const randomType =
      obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

    let height = 0;

    if (randomType === "ARROW") {
      height =
        MIN_ARROW_HEIGHT +
        Math.random() * (MAX_ARROW_HEIGHT - MIN_ARROW_HEIGHT);
    }

    return {
      id: Date.now() + Math.random(),
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
      ARCHER: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      GUARD: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      BEARD: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
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
      const playerWidth = 48;
      const playerHeight = 64;
      const playerX = 150;

      const gameLoop = (delta) => {
        // Update obstacles
        setObstacles((currentObstacles) => {
          let updatedObstacles = currentObstacles
            .map((obstacle) => ({
              ...obstacle,
              x: obstacle.x - scrollSpeed * delta,
            }))
            .filter((obstacle) => obstacle.x > -100);

          setNextObstacleDistance((prev) => prev - scrollSpeed * delta);

          if (nextObstacleDistance <= 0) {
            const newObstacle = generateObstacle();
            updatedObstacles = [...updatedObstacles, newObstacle];
            setNextObstacleDistance(generateRandomDistance());
          }

          return updatedObstacles;
        });

        // Update score
        setScore((prevScore) => prevScore + delta / 60);

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
            setHealth((prevHealth) => {
              const newHealth = prevHealth - 1;
              if (newHealth <= 0) {
                endGame();
              }
              return newHealth;
            });

            setObstacles((currentObstacles) =>
              currentObstacles.filter((obs) => obs.id !== obstacle.id)
            );

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

  // Increase scroll speed by 0.01 for every 5 points in the score
  useEffect(() => {
    const speedIncrease = Math.floor(score / 5) * 0.35;
    const newScrollSpeed = 3.5 + speedIncrease;
    setScrollSpeed(Math.min(newScrollSpeed, MAX_SCROLL_SPEED));
  }, [score]);

  return (
    <Container>
      <Background />
      <HealthDisplay health={health} />
      <ScoreDisplay score={Math.floor(score)} />
      <Player
        position={{ x: 150, y: 365 }}
        onUpdate={(newY) => setPlayerY(newY)}
      />
      {obstacles.map((obstacle) => (
        <Obstacle key={obstacle.id} {...obstacle} />
      ))}
    </Container>
  );
};

export default GameStage;
