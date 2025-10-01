import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../styles/excel-upload.css";
import "../styles/table.css";

import ExcelUpload from "./ExcelUpload";
import TransactionsTable from "./TransactionsTable";
import ManualEntry from "./ManualEntry";

function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("stats");
  const [transactions, setTransactions] = useState([]);

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

  const refreshTransactions = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8000/transactions", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      setTransactions(data);
    } else {
      setTransactions([]);
    }
  };

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
        <button style={{ marginRight: 8 }} onClick={() => setActiveTab("stats")}>Statistics</button>
        <button style={{ marginRight: 8 }} onClick={() => setActiveTab("view")}>View Data</button>
        <button style={{ marginRight: 8 }} onClick={() => setActiveTab("manual")}>Add Manually</button>
        <button onClick={() => setActiveTab("upload")}>Upload Excel</button>
      </div>
      <div>
        {activeTab === "view" && (
          <div>
            <TransactionsTable />
          </div>
        )}
        {activeTab === "manual" && (
          <div>
            <ManualEntry onSuccess={refreshTransactions} />
          </div>
        )}
        {activeTab === "upload" && (
          <div>
            <ExcelUpload />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;