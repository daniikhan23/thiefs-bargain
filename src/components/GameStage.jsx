import React, { useEffect } from "react";
import { Stage, Container, Sprite } from "@pixi/react";
import { useApp } from "@pixi/react-pixi";

const GameStage = ({ gameState, score, setScore }) => {
  const app = useApp();

  useEffect(() => {
    if (gameState === "playing") {
      const gameLoop = (delta) => {
        // Score Updates
        setScore((prevScore) => prevScore + delta * 0.1);
      };
      app.ticker.add(gameLoop);

      return () => app.ticker.remove(gameLoop);
    }
  }, [gameState, app.ticker, setScore]);

  return (
    <Stage
      options={{ backgroundColor: 0x1099bb }}
      width={"100%"}
      height={"100%"}
    >
      <Container>
        {/* Background */}
        <Player />
        {/* Obstacles */}
        <ScoreDisplay score={Math.floor(score)} />
      </Container>
    </Stage>
  );
};

export default GameStage;
