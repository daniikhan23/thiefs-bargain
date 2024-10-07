import React, { useMemo, useRef } from "react";
import { TilingSprite, useTick, useApp } from "@pixi/react";
import { Texture } from "pixi.js";

const Ground = ({ scrollSpeed, tileImage }) => {
  const app = useApp();

  // Load the tile texture
  const tileTexture = useMemo(() => Texture.from(tileImage), [tileImage]);

  // Get tile dimensions
  const tileWidth = tileTexture.width;
  const tileHeight = tileTexture.height;

  // Calculate the scale to fit the desired ground height
  const desiredHeight = 50; // Adjust as needed
  const scale = useMemo(() => {
    return desiredHeight / tileHeight;
  }, [desiredHeight, tileHeight]);

  // Position and movement
  const tilePositionXRef = useRef(0);

  // Update the tile position to create scrolling effect
  useTick((delta) => {
    tilePositionXRef.current -= scrollSpeed * delta;
  });

  return (
    <TilingSprite
      texture={tileTexture}
      x={0}
      y={app.screen.height - tileHeight * scale}
      width={app.screen.width}
      height={tileHeight * scale}
      tilePosition={{ x: tilePositionXRef.current, y: 0 }}
      tileScale={{ x: scale, y: scale }}
    />
  );
};

export default Ground;
