import "./styles/App.css";
import Game from "./components/Game";

function App() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
        <Game />
      </div>
    </>
  );
}

export default App;
