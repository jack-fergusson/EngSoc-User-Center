import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClubEventsProvider } from "./contexts/ClubEventsContext";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import Groups from "./pages/Groups/Groups";
import About from "./pages/About/About";
import Login from "./pages/Login/Login";
import Club from "./pages/Club/Club";

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
          <Route path="/login" element={<Login />} />
          <Route path="/club/:clubId" element={<Club />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ClubEventsProvider>
  );
}

export default App;
