import React from "react";
import { Text, useApp } from "@pixi/react";
import { TextStyle } from "pixi.js";

const ScoreDisplay = ({ score }) => {
  const app = useApp();
  const style = new TextStyle({
    fill: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  });

  return (
    <Text
      text={`Score: ${Math.floor(score)}`}
      style={style}
      x={app.screen.width - 20}
      y={20}
      anchor={{ x: 1, y: 0 }}
    />
  );
};

export default ScoreDisplay;
