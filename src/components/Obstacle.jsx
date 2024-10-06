import React, { useMemo, useEffect } from "react";
import { Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import arrowImage from "../../public/assets/obstacles/Arrow.png";
import enemyImage from "../../public/assets/obstacles/enemy/Transparent PNG/running/frame-1.png";
import spikeImage from "../../public/assets/obstacles/spikes/Free game obstacle spike/transparent PNG/spike A.png";

const OBSTACLE_TYPES = {
  ARROW: {
    image: arrowImage,
    width: 48,
    height: 10,
    yOffset: 0,
    isGroundObstacle: false,
  },
  SPIKE: {
    image: spikeImage,
    width: 48,
    height: 48,
    yOffset: 0,
    isGroundObstacle: true,
  },
  ENEMY: {
    image: enemyImage,
    width: 40,
    height: 50,
    yOffset: 0,
    isGroundObstacle: true,
  },
};

const Obstacle = ({ x, height, type, onUpdate }) => {
  const obstacleProps = OBSTACLE_TYPES[type];

  if (!obstacleProps) return null;

  const y = obstacleProps.isGroundObstacle
    ? 400 - obstacleProps.height // Ground level
    : 400 - height; // variable height for flying obstacles

  return (
    <Sprite
      texture={Texture.from(obstacleProps.image)}
      x={x}
      y={y}
      width={obstacleProps.width}
      height={obstacleProps.height}
    />
  );
};

export default Obstacle;
