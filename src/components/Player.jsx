import { useEffect, useState, useMemo, useCallback } from "react";
import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import thiefSprite from "../../public/assets/sprites/thief-1.0/PNG/48x64_scale2x/thief.png";

const GROUND_Y = 350;
const JUMP_VELOCITY = 15;
const GRAVITY = 0.75;

const Player = ({ position }) => {
  const [xPosition, setXPosition] = useState(position.x);
  const [yPosition, setYPosition] = useState(position.y);
  const [isJumping, setIsJumping] = useState("grounded");
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [isDucking, setIsDucking] = useState(false);

  const spriteTexture = useMemo(() => {
    try {
      const frameWidth = 48;
      const frameHeight = 64;
      const frameIndex = 3;
      const frameX = (frameIndex % 3) * frameWidth;
      const frameY = Math.floor(frameIndex / 3) * frameHeight;
      const baseTexture = Texture.from(thiefSprite);
      return new Texture(
        baseTexture,
        new Rectangle(frameX, frameY, frameWidth, frameHeight)
      );
    } catch (error) {
      console.error("Error creating texture:", error);
      return Texture.EMPTY;
    }
  }, []);

  const jump = useCallback(() => {
    if (isJumping === "grounded" && !isDucking) {
      setIsJumping("ascending");
      setJumpVelocity(JUMP_VELOCITY);
    }
  }, [isJumping]);

  const duck = () => {
    if (!isJumping && !isDucking) setIsDucking(true);
    // TODO - with down arrow key (will figure out mobile later)
  };

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "ArrowUp" || event.code === "Space") {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  // for jumping + ducking
  useTick((delta) => {
    if (isJumping !== "grounded") {
      setYPosition((prev) => prev - jumpVelocity * delta);
      setJumpVelocity((prev) => prev - GRAVITY * delta);

      if (yPosition > GROUND_Y) {
        setYPosition(GROUND_Y);
        setJumpVelocity(0);
        setIsJumping("grounded");
      }
    }
  });

  return (
    <Sprite
      texture={spriteTexture}
      x={xPosition}
      y={yPosition}
      anchor={0.5}
      scale={{ x: 1, y: 1 }}
    />
  );
};
export default Player;
