import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClubEventsProvider } from "./contexts/ClubEventsContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import Groups from "./pages/Groups/Groups";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import FQA from "./pages/FQA/FQA";

import Club from "./pages/Club/Club";
import Register from "./pages/Register/Register";
import MyGroup from "./pages/MyGroup/MyGroup";
import api from "./api";

function PrivateRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    api
      .get("/authentication/check", { withCredentials: true })
      .then((res) => setStatus(res.data.loggedIn ? "ok" : "denied"))
      .catch(() => setStatus("denied"));
  }, []);

  if (status === "loading") return null;
  if (status === "denied") return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <ClubEventsProvider>
      <BrowserRouter>
        <Navbar />
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/fqa" element={<FQA />} />
          <Route path="/login" element={<Login />} />
          <Route path="/group/:groupId" element={<Club />} />
          <Route path="/my-group" element={<PrivateRoute><MyGroup /></PrivateRoute>} />
        </Routes>
      
        <Footer />
      </BrowserRouter>
    </ClubEventsProvider>
  );
}

export default App;
