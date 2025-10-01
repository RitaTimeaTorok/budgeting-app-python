import { useState } from "react";
import axios from "axios";
import "../styles/manual-entry.css";

function ManualEntryTable({ onSuccess }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    currency: "",
    category: "",
    subcategory: "",
    flow: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Coerce amount to number while allowing empty during typing
    const payload = { ...form, amount: form.amount === "" ? "" : Number(form.amount) };

    try {
      await axios.post("http://localhost:8000/transactions", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Entry added!");
      setForm({ description: "", amount: "", currency: "", category: "", subcategory: "", flow: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <form className="grid-form" onSubmit={handleSubmit}>
      <div className="grid-card">
        <div className="grid-title">Manual Entry</div>

        <div className="table-wrap">
          <table className="excel-table" role="grid">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Flow</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="e.g. Coffee"
                    required
                  />
                </td>
                <td>
                  <input
                    name="amount"
                    value={form.amount}
                    onChange={(e) => {
                      // allow only digits and one dot/comma, normalize comma to dot
                      const v = e.target.value.replace(",", ".");
                      if (/^\d*([.]\d{0,2})?$/.test(v) || v === "") {
                        setForm((f) => ({ ...f, amount: v }));
                      }
                    }}
                    inputMode="decimal"
                    placeholder="0.00"
                    required
                  />
                </td>
                <td>
                  <input
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    placeholder="RON"
                    maxLength={3}
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </td>
                <td>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Food"
                    required
                  />
                </td>
                <td>
                  <input
                    name="subcategory"
                    value={form.subcategory}
                    onChange={handleChange}
                    placeholder="Coffee"
                  />
                </td>
                <td>
                  <input
                    name="flow"
                    value={form.flow}
                    onChange={handleChange}
                    placeholder="OUT / IN"
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid-actions">
          <button type="submit" className="grid-submit">Submit</button>
          <div className="grid-message">{message}</div>
        </div>
      </div>
    </form>
  );
}

export default ManualEntryTable;
