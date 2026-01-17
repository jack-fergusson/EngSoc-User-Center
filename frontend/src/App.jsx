import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Calendar from "./pages/Calendar/Calendar";
import Groups from "./pages/Groups/Groups";
import Login from "./pages/Login/Login";
import FQA from "./pages/FQA/FQA";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fqa" element={<FQA />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
