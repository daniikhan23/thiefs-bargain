import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sprite, useTick, useApp } from "@pixi/react";
import { Texture } from "pixi.js";

import forestBackTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/back-trees.png";
import forestFrontTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/front-trees.png";
import forestLight from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/lights.png";
import forestMiddleTrees from "../../public/assets/background/true-bgs/parallax_forest_pack/parallax_forest_pack/layers/middle-trees.png";

const Background = () => {
  const app = useApp();

  const layers = useMemo(
    () => [
      {
        image: forestBackTrees,
        speed: 0.2,
      },
      {
        image: forestLight,
        speed: 0.4,
      },
      {
        image: forestMiddleTrees,
        speed: 0.6,
      },
      {
        image: forestFrontTrees,
        speed: 0.8,
      },
    ],
    []
  );

  const textures = useMemo(() => {
    return layers.map((layer) => Texture.from(layer.image));
  }, [layers]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkTexturesLoaded = async () => {
      const promises = textures.map((texture) => {
        return new Promise((resolve) => {
          if (texture.baseTexture.valid) {
            resolve();
          } else {
            texture.baseTexture.once("loaded", () => {
              resolve();
            });
          }
        });
      });
      await Promise.all(promises);
      if (isMounted) {
        setLoaded(true);
      }
    };
    checkTexturesLoaded();
    return () => {
      isMounted = false;
    };
  }, [textures]);

  const scales = useMemo(() => {
    if (!loaded) return layers.map(() => 1);
    return textures.map((texture) => {
      return app.screen.height / texture.height;
    });
  }, [loaded, textures, app.screen.height]);

  const positionsRef = useRef(layers.map(() => 0));

  useTick((delta) => {
    if (!loaded) return; // Wait until textures are loaded

    layers.forEach((layer, index) => {
      const speed = layer.speed;
      let pos = positionsRef.current[index];
      pos -= speed * delta;

      const textureWidth = textures[index].width * scales[index];

      if (pos <= -textureWidth) {
        pos += textureWidth;
      }
      positionsRef.current[index] = pos;
    });
  });

  if (!loaded) {
    return null; // Or render a loading indicator
  }

  return (
    <>
      {layers.map((layer, index) => {
        const textureWidth = textures[index].width * scales[index];
        const position = positionsRef.current[index];
        return (
          <React.Fragment key={`layer-${index}`}>
            {/* First copy of the layer */}
            <Sprite
              texture={textures[index]}
              x={position}
              y={0}
              scale={{ x: scales[index], y: scales[index] }}
            />
            {/* Second copy for seamless looping */}
            <Sprite
              texture={textures[index]}
              x={position + textureWidth}
              y={0}
              scale={{ x: scales[index], y: scales[index] }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default Background;
