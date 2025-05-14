import "./App.css";
import { Route, Routes } from "react-router";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import { Fans } from "./components/Fans";
import { Rankings } from "./components/Rankings";
import { Sweepstakes } from "./components/Sweepstakes";
import { Profile } from "./components/Profile";
import { ProfileEdit } from "./components/ProfileEdit";
import { Sweepstake } from "./components/Sweepstake";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";

function App() {
  return (
    <div className="w-full flex-1 flex flex-col bg-accent">
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        {/* move to protected and public later */}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="fans" element={<Fans />} />
        <Route path="leaderboard" element={<Rankings />} />
        <Route path="sweepstakes">
          <Route index element={<Sweepstakes />} />
          <Route path=":sweepstakeId" element={<Sweepstake />} />
        </Route>
        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="edit" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
