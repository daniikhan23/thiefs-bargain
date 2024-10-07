import React, { useState, useEffect, useMemo, useRef } from "react";
import { Sprite, useTick, useApp } from "@pixi/react";
import { Texture } from "pixi.js";

const Background = ({ layers }) => {
  const app = useApp();

  // Load textures only when layers change
  const textures = useMemo(() => {
    return layers.map((layer) => Texture.from(layer.image));
  }, [layers]);

  const [loaded, setLoaded] = useState(false);

  // Check if all textures are loaded
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

  // Calculate scales based on screen height
  const scales = useMemo(() => {
    if (!loaded) return layers.map(() => 1);
    return textures.map((texture) => {
      return app.screen.height / texture.height;
    });
  }, [loaded, textures, app.screen.height]);

  const positionsRef = useRef([]);

  // Reset positions when layers change
  useEffect(() => {
    positionsRef.current = layers.map(() => 0);
  }, [layers]);

  // Update positions in useTick without causing re-renders
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

  // Render the background layers
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
