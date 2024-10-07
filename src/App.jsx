import "./styles/App.css";
import Game from "./components/Game";

function App() {
  return (
    <>
      <div
        className="flex flex-col justify-center items-center h-screen"
        style={{
          backgroundImage: `url('../../public/assets/background-img/bg-2.png')`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Game />
      </div>
    </>
  );
}

export default App;
