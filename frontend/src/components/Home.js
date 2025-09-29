import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <h2>Home Page</h2>
      <p>Login was successful!</p>
    </div>
  );
}

export default Home;