import { SceneComponent } from "../pages/SceneComponent.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home.tsx";

export default () => (
  <Router>
    <Routes>
      {/* ホームページのルート */}
      <Route path="/" element={<Home />} />

      <Route path="/box" element={<SceneComponent />} />
    </Routes>
  </Router>
);
