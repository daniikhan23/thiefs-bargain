import { useState, useEffect } from "react";
import { Texture } from "pixi.js";

const useLoadedTextures = (layers) => {
  const [textures, setTextures] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const loadTextures = async () => {
      const promises = layers.map((layer) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = layer.image;
          img.onload = () => {
            const texture = Texture.from(img);
            resolve({
              texture,
              width: img.width,
              height: img.height,
            });
          };
          img.onerror = (e) => {
            console.error(`Failed to load image: ${layer.image}`, e);
            reject(e);
          };
        });
      });

      try {
        const loadedTextures = await Promise.all(promises);
        if (!isCancelled) {
          setTextures(loadedTextures);
          setLoaded(true);
        }
      } catch (e) {
        console.error("Error loading textures", e);
      }
    };

    loadTextures();

    return () => {
      isCancelled = true;
    };
  }, [layers]);

  return { textures, loaded };
};

export default useLoadedTextures;
