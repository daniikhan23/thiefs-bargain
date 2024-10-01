import { useEffect, useState, useMemo } from "react";
import { Sprite, useTick } from "@pixi/react";
import { Texture, Rectangle } from "pixi.js";
import thiefSprite from "../../public/assets/sprites/thief-1.0/PNG/48x64_scale2x/thief.png";

const Player = ({ position }) => {
  const [xPosition, setXPosition] = useState(position.x);
  const [yPosition, setYPosition] = useState(position.y);
  const [isJumping, setIsJumping] = useState(false);
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

  useTick((delta) => {
    // for jumping + ducking
  });

  const jump = () => {
    if (!isJumping && !isDucking) setIsJumping(true);
    // TODO - with up arrow key (will figure out mobile later)
  };

  const duck = () => {
    if (!isJumping && !isDucking) setIsDucking(true);
    // TODO - with down arrow key (will figure out mobile later)
  };

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
