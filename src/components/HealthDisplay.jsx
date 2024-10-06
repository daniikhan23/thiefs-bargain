import React from "react";
import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import heartImage from "../../public/assets/character/heart.png";

const HEART_WIDTH = 32;
const HEART_HEIGHT = 32;
const HEART_SPACING = 5;

const HealthDisplay = ({ health }) => {
  const hearts = [];

  for (let i = 0; i < health; i++) {
    hearts.push(
      <Sprite
        key={i}
        texture={Texture.from(heartImage)}
        x={20 + i * (HEART_WIDTH + HEART_SPACING)}
        y={20}
        width={HEART_WIDTH}
        height={HEART_HEIGHT}
      />
    );
  }

  return <Container>{hearts}</Container>;
};

export default HealthDisplay;
