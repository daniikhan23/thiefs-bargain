import React, { useState } from "react";
import { Sprite, useTick, useApp } from "@pixi/react";
import useLoadedTextures from "./useLoadedTextures"; // Adjust the import path

import mountainBg from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-bg.png";
import mountainFar from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-montain-far.png";
import mountains from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-mountains.png";
import trees from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-trees.png";
import mountainForegroundTrees from "../../public/assets/background/true-bgs/parallax_mountain_pack/parallax_mountain_pack/layers/mountain-foreground-trees.png";

const Background = () => {
  const app = useApp();

  const layers = [
    {
      image: mountainBg,
      speed: 0.2,
    },
    {
      image: mountainFar,
      speed: 0.4,
    },
    {
      image: mountains,
      speed: 0.6,
    },
    {
      image: trees,
      speed: 0.8,
    },
    {
      image: mountainForegroundTrees,
      speed: 1.0,
    },
  ];

  // Use the custom hook to load textures
  const { textures, loaded } = useLoadedTextures(layers);

  // Initialize positions for each layer
  const [positions, setPositions] = useState(layers.map(() => 0));

  // Calculate scales to fit screen height
  const scales = loaded
    ? textures.map(({ height }) => {
        return app.screen.height / height;
      })
    : layers.map(() => 1); // Default scale of 1 when textures are not loaded

  // Use useTick unconditionally
  useTick((delta) => {
    if (!loaded) return; // Wait until textures are loaded

    setPositions((prevPositions) =>
      prevPositions.map((pos, index) => {
        const speed = layers[index].speed;
        let newPos = pos - speed * delta;
        const textureWidth = textures[index].width * scales[index];

        // Loop the background
        if (newPos <= -textureWidth) {
          newPos += textureWidth;
        }
        return newPos;
      })
    );
  });

  // Conditionally render content based on loaded state
  if (!loaded) {
    return null; // Or render a loading indicator
  }

  return (
    <>
      {layers.map((layer, index) => {
        const textureWidth = textures[index].width * scales[index];
        // Calculate the number of copies needed
        const copies = Math.ceil(app.screen.width / textureWidth) + 1;

        return (
          <React.Fragment key={`layer-${index}`}>
            {Array.from({ length: copies }).map((_, copyIndex) => (
              <Sprite
                key={`layer-${index}-copy-${copyIndex}`}
                texture={textures[index].texture}
                x={positions[index] + textureWidth * copyIndex}
                y={0}
                scale={scales[index]}
              />
            ))}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Background;
