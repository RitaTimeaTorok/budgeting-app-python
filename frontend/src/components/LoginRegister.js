import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";

const API_URL = "http://127.0.0.1:8000";


function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== repeatPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    const endpoint = isLogin ? "/login" : "/register";
    try {
      const response = await axios.post(API_URL + endpoint, {
        username,
        password,
      });
      if (isLogin) {
        setMessage("Login successful!");
        localStorage.setItem("token", response.data.access_token);
        navigate("/home");
      } else {
        setMessage("Registration successful! You can now log in.");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.detail || "An error occurred. Try again."
      );
    }
  };

  return (
    <div className="app-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          type="text"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <input
            placeholder="Repeat Password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button
        onClick={() => {
          setIsLogin(!isLogin);
          setUsername("");
          setPassword("");
          setRepeatPassword("");
          setMessage("");
        }}
      >
        {isLogin ? "Need an account? Register" : "Already have an account? Login"}
      </button>
      <div className="message">{message}</div>
    </div>
  );
}

export default LoginRegister;