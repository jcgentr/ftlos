// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import { Fans } from "./components/Fans";
import { Rankings } from "./components/Rankings";
import { Sweepstakes } from "./components/Sweepstakes";
import { Profile } from "./components/Profile";

function App() {
  return (
    <div className="w-full h-full flex flex-col">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="fans" element={<Fans />} />
        <Route path="leaderboard" element={<Rankings />} />
        <Route path="sweepstakes" element={<Sweepstakes />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
