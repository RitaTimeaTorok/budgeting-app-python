import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/table.css";

// Helper to format date as YYYY-MM-DD
function formatDate(dateString) {
  if (!dateString) return '';
  // Handles both ISO and other formats
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  return d.toISOString().slice(0, 10);
}

function TransactionTable() {
   const [transactions, setTransactions] = useState([]);
   const [error, setError] = useState("");

   useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get("http://localhost:8000/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTransactions(response.data);
            } catch (err) {
                setError("Failed to fetch transactions.");
            }
        };
        fetchData();
   }, []);

   const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete transaction.");
    }
  };

   if (error) {
        return <div className="message">{error}</div>;
   }
   if (transactions.length === 0) {
        return <div className="message">No data found.</div>;
   }

   return (
    <div style={{ overflowX: "auto" }}>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Flow</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{formatDate(t.date)}</td>
              <td>{t.description}</td>
              <td>{t.amount}</td>
              <td>{t.currency}</td>
              <td>{t.category}</td>
              <td>{t.subcategory}</td>
              <td>{t.flow}</td>
              <td>
                <button
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => handleDelete(t.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   );
}

export default TransactionTable;