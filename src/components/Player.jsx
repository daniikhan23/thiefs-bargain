import React, { useState, useEffect, useMemo } from "react";
import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import thiefSprite from "../../public/assets/sprites/thief-1.0/PNG/48x64_scale2x/thief.png";
import soundManager from "./SoundManager";

const FRAME_WIDTH = 48;
const FRAME_HEIGHT = 64;
const ANIMATION_SPEED = 0.3;
const SECOND_ROW_Y = 64;

// Jump physics constants
const JUMP_INITIAL_VELOCITY = -5.5;
const GRAVITY = 0.1;
const GROUND_Y = 365; // This should match your original y position

const Player = ({ position, onUpdate }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [verticalVelocity, setVerticalVelocity] = useState(0);
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [isJumping, setIsJumping] = useState(false);

  const textures = useMemo(() => {
    const baseTexture = Texture.from(thiefSprite);
    return [
      new Texture(
        baseTexture,
        new Rectangle(0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ),
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ),
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH * 0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ),
      new Texture(
        baseTexture,
        new Rectangle(FRAME_WIDTH * 0, SECOND_ROW_Y, FRAME_WIDTH, FRAME_HEIGHT)
      ),
    ];
  }, []);

  useTick((delta) => {
    // Handle regular animation
    setCurrentFrame((prevFrame) => {
      const nextFrame = prevFrame + ANIMATION_SPEED * delta;
      return nextFrame % textures.length;
    });

    if (isJumping) {
      // Update position
      const newY = playerY + verticalVelocity;

      // Apply gravity
      const newVelocity = verticalVelocity + GRAVITY;

      // Check if landed
      if (newY >= GROUND_Y) {
        setPlayerY(GROUND_Y);
        setVerticalVelocity(0);
        setIsJumping(false);
      } else {
        setPlayerY(newY);
        setVerticalVelocity(newVelocity);
      }
    }

    const playerWidth = FRAME_WIDTH;
    const playerHeight = FRAME_HEIGHT;

    const playerBoundingBox = {
      x: position.x - playerWidth / 2,
      y: playerY - playerHeight / 2,
      width: playerWidth,
      height: playerHeight,
    };

    if (onUpdate) {
      onUpdate(playerY);
    }
  });

  const handleKeyDown = (event) => {
    if ((event.code === "Space" || event.code === "ArrowUp") && !isJumping) {
      soundManager.playSound("jump");
      setIsJumping(true);
      setVerticalVelocity(JUMP_INITIAL_VELOCITY);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJumping]);

  return (
    <Sprite
      texture={textures[Math.floor(currentFrame)]}
      x={position.x}
      y={playerY}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
    />
  );
};

export default Player;
