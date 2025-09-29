import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

function Home() {
  const navigate = useNavigate();

  // Check if the token exists, if not, redirect to login page
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  // Remove token from local storage and navigate back to login
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
      <button onClick={() => navigate("/upload")}>
        Upload Excel File
      </button>
    </div>
  );
}

export default Home;