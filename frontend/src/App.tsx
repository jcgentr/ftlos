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
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Toaster } from "sonner";
import { ProfileOther } from "./components/ProfileOther";
import { SweepstakesAdmin } from "./components/SweepstakesAdmin";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors />
      <div className="w-full flex-1 flex flex-col bg-accent">
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />

          {/* protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route index element={<Home />} />
            <Route path="fans" element={<Fans />} />
            <Route path="leaderboard" element={<Rankings />} />

            <Route path="sweepstakes">
              <Route index element={<Sweepstakes />} />
              <Route path="admin" element={<SweepstakesAdmin />} />
              <Route path=":sweepstakeId" element={<Sweepstake />} />
            </Route>

            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="edit" element={<ProfileEdit />} />
              <Route path=":profileId" element={<ProfileOther />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
