import React, { useEffect, useState } from "react";
import { Container, useApp } from "@pixi/react";
import Background from "./Background";
import Player from "./Player";
import ScoreDisplay from "./ScoreDisplay";
import HealthDisplay from "./HealthDisplay";
import Obstacle from "./Obstacle";
import forestBackTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/back-trees.png";
import forestFrontTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/front-trees.png";
import forestLight from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/lights.png";
import forestMiddleTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/middle-trees.png";
import mountainBg from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-bg.png";
import mountainFar from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-montain-far.png";
import mountains from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-mountains.png";
import trees from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-trees.png";
import mountainForegroundTrees from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-foreground-trees.png";
import industrialBg from "../../public/assets/background/true-bgs/parallax-industrial-pack/parallax-industrial-pack/layers/bg.png";
import industrialForeground from "../../public/assets/background/true-bgs/parallax-industrial-pack/parallax-industrial-pack/layers/foreground.png";
import industrialBuildings from "../../public/assets/background/true-bgs/parallax-industrial-pack/parallax-industrial-pack/layers/buildings.png";
import industrialFarBuildings from "../../public/assets/background/true-bgs/parallax-industrial-pack/parallax-industrial-pack/layers/far-buildings.png";

const MAX_SCROLL_SPEED = 10;
const MIN_OBSTACLE_DISTANCE = 200;
const MAX_OBSTACLE_DISTANCE = 500;
const MIN_ARROW_HEIGHT = 10;
const MAX_ARROW_HEIGHT = 150;

const backgroundSets = [
  // First background set (Forest)
  [
    {
      image: forestBackTrees,
      speed: 0.2,
    },
    {
      image: forestLight,
      speed: 0.4,
    },
    {
      image: forestMiddleTrees,
      speed: 0.6,
    },
    {
      image: forestFrontTrees,
      speed: 0.8,
    },
  ],
  // Second background set (Mountains)
  [
    {
      image: mountainBg,
      speed: 0.2,
    },
    {
      image: mountainFar,
      speed: 0.4,
    },
    {
      image: mountains,
      speed: 0.6,
    },
    {
      image: trees,
      speed: 0.8,
    },
    {
      image: mountainForegroundTrees,
      speed: 1.0,
    },
  ],
  // Third background set (Industrial)
  [
    {
      image: industrialBg,
      speed: 0.2,
    },
    {
      image: industrialFarBuildings,
      speed: 0.4,
    },
    {
      image: industrialBuildings,
      speed: 0.6,
    },
    {
      image: industrialForeground,
      speed: 0.8,
    },
  ],
];

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
  const [backgroundLayers, setBackgroundLayers] = useState([]);

  const generateRandomDistance = () => {
    return (
      MIN_OBSTACLE_DISTANCE +
      Math.random() * (MAX_OBSTACLE_DISTANCE - MIN_OBSTACLE_DISTANCE)
    );
  };

  const generateObstacle = () => {
    const obstacleTypes = [
      "ARROW",
      "SPIKE",
      "ARCHER",
      "GUARD",
      "BEARD",
      "SAMURAI",
      "SOLDIER",
      "KING",
      "TAXMAN",
      "KNIGHT",
    ];
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
      SAMURAI: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      SOLDIER: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      KING: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      TAXMAN: {
        width: 48,
        height: 64,
        isGroundObstacle: true,
        isAnimated: true,
        frames: 3,
      },
      KNIGHT: {
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

  // Randomly select a background set when game starts or restarts
  useEffect(() => {
    if (gameState === "playing" || gameState === "restart") {
      const randomIndex = Math.floor(Math.random() * backgroundSets.length);
      setBackgroundLayers(backgroundSets[randomIndex]);

      // Reset other game states if necessary
      setObstacles([]);
      setNextObstacleDistance(generateRandomDistance());
      setScrollSpeed(3.5);
      setScore(0);
      setHealth(3); // Assuming the player starts with 3 health points
    }
  }, [gameState, setScore, setHealth]);

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
    obstacles,
    playerY,
    scrollSpeed,
    setObstacles,
    setNextObstacleDistance,
    setHealth,
    endGame,
  ]);

  // Increase scroll speed by 0.35 for every 5 points in the score
  useEffect(() => {
    const speedIncrease = Math.floor(score / 5) * 0.35;
    const newScrollSpeed = 3.5 + speedIncrease;
    setScrollSpeed(Math.min(newScrollSpeed, MAX_SCROLL_SPEED));
  }, [score]);

  return (
    <Container>
      <Background layers={backgroundLayers} />
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
