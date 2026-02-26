import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClubEventsProvider } from "./contexts/ClubEventsContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import Groups from "./pages/Groups/Groups";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import NetIDLogin from "./pages/NetIDLogin/NetIDLogin";
import FQA from "./pages/FQA/FQA";

import Club from "./pages/Club/Club";
import Register from "./pages/Register/Register";

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
          <Route path="/login/netid" element={<NetIDLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/club/:clubId" element={<Club />} />
        </Routes>
      
        <Footer />
      </BrowserRouter>
    </ClubEventsProvider>
  );
}

export default App;
