import React, { useMemo } from "react";
import { Sprite, useApp } from "@pixi/react";
import { Texture } from "pixi.js";
import beachBg from "../../public/assets/background/beach/png/full_background.png";

const Background = () => {
  const app = useApp();

  const backgroundTexture = useMemo(() => Texture.from(beachBg), []);

  const scale = app.screen.width / backgroundTexture.width;

  const scaledHeight = backgroundTexture.height * scale;

  return (
    <Sprite
      texture={backgroundTexture}
      width={app.screen.width}
      height={scaledHeight}
      x={0}
      y={(app.screen.height - scaledHeight) / 2}
    />
  );
};

export default Background;
