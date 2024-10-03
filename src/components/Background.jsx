import React, { useMemo } from "react";
import { Sprite, useApp } from "@pixi/react";
import { Texture } from "pixi.js";
import beachBg from "../../public/assets/background/beach/png/full_background.png";

const Background = () => {
  const app = useApp();

  const backgroundTexture = useMemo(() => Texture.from(beachBg), []);

  // Calculate scale to fit the background width to the container width
  const scale = app.screen.width / backgroundTexture.width;

  // Calculate the scaled height
  const scaledHeight = backgroundTexture.height * scale;

  return (
    <Sprite
      texture={backgroundTexture}
      width={app.screen.width}
      height={scaledHeight}
      x={0}
      y={(app.screen.height - scaledHeight) / 2} // Center vertically if shorter than container
    />
  );
};

export default Background;
