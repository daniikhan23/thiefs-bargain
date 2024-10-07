import React, { useMemo, useState } from "react";
import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import arrowImage from "../../public/assets/obstacles/Arrow.png";
import spikeImage from "../../public/assets/obstacles/spikes/Free game obstacle spike/transparent PNG/spike A.png";
import archerImage from "../../public/assets/obstacles/enemy/archer/archer.png";
import guardImage from "../../public/assets/obstacles/enemy/guard/guard.png";
import beardImage from "../../public/assets/obstacles/enemy/angry-man/beardmannpc.png";
import samuraiImage from "../../public/assets/obstacles/enemy/samurai/samurai1npc.png";
import soldierImage from "../../public/assets/obstacles/enemy/soldier/youngsoldiernpc.png";
import kingImage from "../../public/assets/obstacles/enemy/king/wannabekingnpc.png";
import taxmanImage from "../../public/assets/obstacles/enemy/taxman/taxmannpc.png";
import knightImage from "../../public/assets/obstacles/enemy/knight/knight.png";

const ANIMATION_SPEED = 0.1; // Adjust for smoother animation
const GROUND_Y = 555; // Adjust based on your ground level

const OBSTACLE_TYPES = {
  ARROW: {
    image: arrowImage,
    width: 48,
    height: 10,
    isGroundObstacle: false,
    isAnimated: false,
    frames: 1,
  },
  SPIKE: {
    image: spikeImage,
    width: 48,
    height: 48,
    isGroundObstacle: true,
    isAnimated: false,
    frames: 1,
  },
  ARCHER: {
    image: archerImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  GUARD: {
    image: guardImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  BEARD: {
    image: beardImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  SAMURAI: {
    image: samuraiImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  SOLDIER: {
    image: soldierImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  KING: {
    image: kingImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  TAXMAN: {
    image: taxmanImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
  KNIGHT: {
    image: knightImage,
    width: 48,
    height: 64,
    isGroundObstacle: true,
    isAnimated: true,
    frames: 3,
  },
};

const Obstacle = ({ x, height, type }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const obstacleProps = OBSTACLE_TYPES[type];

  if (!obstacleProps) return null;

  const textures = useMemo(() => {
    if (!obstacleProps.isAnimated) {
      return [Texture.from(obstacleProps.image)];
    }

    const baseTexture = Texture.from(obstacleProps.image);
    const frameWidth = obstacleProps.width;
    const frameHeight = obstacleProps.height;
    const fourthRowY = frameHeight * 3;

    const frames = [];

    for (let i = 0; i < obstacleProps.frames; i++) {
      const frameTexture = new Texture(
        baseTexture,
        new Rectangle(i * frameWidth, fourthRowY, frameWidth, frameHeight)
      );
      frames.push(frameTexture);
    }

    return frames;
  }, [obstacleProps]);

  useTick((delta) => {
    if (obstacleProps.isAnimated) {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + ANIMATION_SPEED * delta;
        return nextFrame % textures.length;
      });
    }
  });

  const y = obstacleProps.isGroundObstacle
    ? GROUND_Y - obstacleProps.height
    : GROUND_Y - height;

  return (
    <Sprite
      texture={textures[Math.floor(currentFrame)]}
      x={x}
      y={y}
      width={obstacleProps.width}
      height={obstacleProps.height}
    />
  );
};

export default Obstacle;
