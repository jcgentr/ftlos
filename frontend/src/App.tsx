// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { Navbar } from "./components/Navbar";
import { SpotifyPage } from "./components/SpotifyPage";

function App() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="spotify" element={<SpotifyPage />} />
      </Routes>
    </div>
  );
}

export default App;
