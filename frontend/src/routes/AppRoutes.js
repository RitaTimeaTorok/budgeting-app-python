// This file centralizes the route definitions

import { Routes, Route } from "react-router-dom";
import LoginRegister from "../components/LoginRegister";
import Home from "../components/Home";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default AppRoutes;