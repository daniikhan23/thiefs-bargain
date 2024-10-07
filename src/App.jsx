import "./styles/App.css";
import Game from "./components/Game";

function App() {
  return (
    <>
      <div className="app flex flex-col justify-center items-center h-screen">
        <Game />
      </div>
    </>
  );
}

export default App;
