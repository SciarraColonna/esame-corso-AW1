import { Route, Routes } from "react-router-dom";
import Home from "./components/Home.jsx";
import Match from "./components/Match.jsx";
import Login from "./components/Login.jsx";
import Recap from "./components/Recap.jsx";
import History from "./components/History.jsx";
import { useState } from "react";
import API from "./API.js";
import "./App.css"


function App() {
  // states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const FAST_MATCH_ROUNDS = 1;
  const AUTH_MATCH_ROUNDS = 3;

  // function handling the login verification
  const handleLogin = async (credentials) => {
    const user = await API.login(credentials);
    setUser(user);
    setIsLoggedIn(true);
    return user;
  }

  // function handling the logout verification
  const handleLogout = async () => {
    await API.logout();
    setIsLoggedIn(false);
    setUser(null);
  }

  return (
    <div id='layout-container'>
      {/* layout title */}
      <h1 id="page-title">WHAT DO YOU <span>MEME</span>?</h1>

      {/* routes */}
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/play" element={<Match rounds={FAST_MATCH_ROUNDS} />}></Route>
        <Route path="/login" element={<Login login={handleLogin} />}></Route>
        <Route path="/users/:id" element={<Home isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout}/>}></Route>
        <Route path="/users/:id/play" element={<Match rounds={AUTH_MATCH_ROUNDS} user={user} />}></Route>
        <Route path="/users/:id/play/recap" element={<Recap user={user} />}></Route>
        <Route path="/users/:id/history" element={<History user={user} />}></Route>
      </Routes>

      {/* page footer */}
      <footer>
        <p>Copyright &copy; What Do You Meme 2024</p>
        <p>A game by SciarraColonna</p>
      </footer>
    </div>
  );
}

export default App;