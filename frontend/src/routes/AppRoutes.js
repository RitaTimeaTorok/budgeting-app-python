// This file centralizes the route definitions

import { Routes, Route } from "react-router-dom";
import LoginRegister from "../components/LoginRegister";
import Home from "../components/Home";
import ExcelUpload from "../components/ExcelUpload";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginRegister />} />
      <Route path="/home" element={<Home />} />
      <Route path="/upload" element={<ExcelUpload />} />
    </Routes>
  );
}

export default AppRoutes;