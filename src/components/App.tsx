import { Box } from "../pages/Box.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home.tsx";
import { House } from "../pages/House.tsx";
import { Village } from "../pages/Village.tsx";

export default () => (
  <Router>
    <Routes>
      {/* ホームページのルート */}
      <Route path="/" element={<Home />} />

      <Route path="/box" element={<Box />} />
      <Route path="/house" element={<House />} />
      <Route path="/village" element={<Village />} />
    </Routes>
  </Router>
);
