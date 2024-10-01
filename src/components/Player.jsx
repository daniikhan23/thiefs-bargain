import { AnimatedSprite, Texture } from "pixi.js";
import { useEffect, useState } from "react";

const Player = ({ position }) => {
  const { x, y } = position;
  const [xPosition, setXPosition] = useState(x);
  const [yPosition, setYPosition] = useState(y);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);

  useEffect(() => {
    // for jumping + ducking
  });

  const jump = () => {
    // TODO - with up arrow key (will figure out mobile later)
    if (isJumping === false && isDucking === false) setIsJumping(true);
  };

  const duck = () => {
    // TODO - with down arrow key (will figure out mobile later)
    if (isJumping === false && isDucking === false) setIsDucking(true);
  };

  return (
    <div
      className="player"
      style={{
        position: "absolute",
        left: x,
        top: y,
        height: "50px",
        width: "50px",
      }}
    ></div>
  );
};
export default Player;
