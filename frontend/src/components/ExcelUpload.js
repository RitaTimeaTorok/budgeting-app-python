import { useState } from "react";
import axios from "axios";

function ExcelUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/upload-excel", formData, {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });
      setMessage("Upload successful!");
    } catch (err) {
      const details = err?.response?.data?.detail || err.message;
      setMessage(`Upload failed: ${details}`);
    }
  };

  return (
    <div className="app-container">
      <h2>Upload Excel File</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <div className="message">{message}</div>
    </div>
  );
}

export default ExcelUpload;