import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

import ExcelUpload from "./ExcelUpload";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUsername(payload.sub);
      } catch {
        setUsername("");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-container" style={{ position: "relative" }}>
      <div style={{ position: "fixed", top: 24, right: 32, zIndex: 10 }}>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h2 style={{ marginTop: 0, textAlign: "center" }}>
        Welcome to my little budgeting app{username && `, ${username}`}!
      </h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <button style={{ marginRight: 8 }} onClick={() => setActiveTab("view")}>View Data</button>
        <button style={{ marginRight: 8 }} onClick={() => setActiveTab("upload")}>Upload Excel</button>
        <button onClick={() => setActiveTab("manual")}>Add Manually</button>
      </div>
      <div>
        {activeTab === "view" && (
          <div>
            <p>Already existing data (to be implemented).</p>
          </div>
        )}
        {activeTab === "upload" && (
          <div>
            <ExcelUpload />
          </div>
        )}
        {activeTab === "manual" && (
          <div>
            <p>Manual data entry form (to be implemented).</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;