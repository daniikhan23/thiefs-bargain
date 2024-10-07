import React from "react";
import { Text, Graphics, Container, useApp } from "@pixi/react";
import { TextStyle, TextMetrics } from "pixi.js";

const ScoreDisplay = ({ score }) => {
  const app = useApp();

  // Define the text style
  const style = new TextStyle({
    fill: "#000000",
    fontSize: 24,
    fontWeight: "bold",
  });

  // The text to display
  const text = `Score: ${Math.floor(score)}`;

  // Measure the text to get its dimensions
  const textMetrics = TextMetrics.measureText(text, style);

  // Define padding around the text
  const padding = 5;

  // Define the radius for rounded corners
  const cornerRadius = 10; // Adjust this value to change the roundness

  // Position of the score display
  const x = app.screen.width - 20;
  const y = 20;

  return (
    <Container x={x} y={y}>
      {/* Background rectangle with rounded corners */}
      <Graphics
        draw={(g) => {
          g.clear();
          g.beginFill(0xffffff, 0.5); // White color with 50% opacity
          // Draw rounded rectangle based on text dimensions and padding
          g.drawRoundedRect(
            -textMetrics.width - padding * 2, // x position
            0, // y position
            textMetrics.width + padding * 2, // width
            textMetrics.height + padding * 2, // height
            cornerRadius // corner radius
          );
          g.endFill();
        }}
      />
      {/* Text display */}
      <Text
        text={text}
        style={style}
        x={-padding} // Adjust for right alignment
        y={padding}
        anchor={{ x: 1, y: 0 }} // Anchor to the right top corner
      />
    </Container>
  );
};

export default ScoreDisplay;
