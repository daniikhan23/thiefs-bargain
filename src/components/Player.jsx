import React, { useState, useEffect, useMemo } from "react";
import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import thiefSprite from "../../public/assets/sprites/thief-1.0/PNG/48x64_scale2x/thief.png";

const FRAME_WIDTH = 48;
const FRAME_HEIGHT = 64;
const ANIMATION_SPEED = 0.2;
const SECOND_ROW_Y = 64;

const Player = ({ position }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  // Preload textures from the second row of the sprite sheet
  const textures = useMemo(() => {
    const baseTexture = Texture.from(thiefSprite);
    return [
      new Texture(
        baseTexture,
        new Rectangle(0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ), // First frame
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ), // Second frame
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH * 0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ), // Third frame
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH * 0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ), // Fourth frame
    ];
  }, []);

  useTick((delta) => {
    if (!isJumping) {
      setCurrentFrame((prevFrame) => {
        const nextFrame = prevFrame + ANIMATION_SPEED * delta;
        return nextFrame % textures.length; // Ensure the frame wraps within bounds
      });
    }
  });

  const handleKeyDown = (event) => {
    if (event.code === "Space" && !isJumping) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500); // Adjust jump duration as needed
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Sprite
      texture={textures[Math.floor(currentFrame)]}
      x={position.x}
      y={position.y}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
    />
  );
};

export default Player;
