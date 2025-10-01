import { useEffect, useState } from "react";
import "../styles/statistics.css";

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [openMonth, setOpenMonth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated. Please log in.");
      return;
    }

    fetch("http://localhost:8000/statistics", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`HTTP ${res.status} ${res.statusText} — ${text || "no body"}`);
        }
        return res.json();
      })
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <div>Loading...</div>;

  const fmt = (n) =>
    typeof n === "number"
      ? n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : n;

  const months = Array.isArray(stats.months)
    ? stats.months
    : Object.keys(stats.by_month || {}).sort().reverse();

  const byMonth = stats.by_month || {};

  return (
    <div className="statistics">
      {/* Current Balance */}
      <h2>Current Balance</h2>
      <div className="balance-box">{fmt(stats.balance ?? 0)}</div>

      {/* Months */}
      <h3>Months</h3>
      {months.length === 0 && <div>No data yet.</div>}

      <ul className="month-list">
        {months.map((month) => {
          const m =
            byMonth[month] || {
              income_total: 0,
              spending_total: 0,
              net: 0,
              categories_income: {},
              categories_spending: {},
            };
          const isOpen = openMonth === month;

          return (
            <li key={month} className="month-item">
              <div className="month-header">
                <div>
                  <div className="month-name">{month}</div>
                  <div className="month-summary">
                    Income: {fmt(m.income_total)} | Spending: {fmt(m.spending_total)} | Net: {fmt(m.net)}
                  </div>
                </div>
                <button
                  onClick={() => setOpenMonth(isOpen ? null : month)}
                  className={`toggle-btn ${isOpen ? "open" : ""}`}
                >
                  {isOpen ? "Hide statistics" : "See statistics"}
                </button>
              </div>

              {isOpen && (
                <div className="month-details">
                  <div className="categories">
                    <div>
                      <h4>Income by Category</h4>
                      {Object.keys(m.categories_income || {}).length === 0 ? (
                        <div className="empty">No income this month.</div>
                      ) : (
                        <ul>
                          {Object.entries(m.categories_income || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, amt]) => (
                              <li key={cat}>
                                {cat}: {fmt(amt)}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                    <div>
                      <h4>Spending by Category</h4>
                      {Object.keys(m.categories_spending || {}).length === 0 ? (
                        <div className="empty">No spending this month.</div>
                      ) : (
                        <ul>
                          {Object.entries(m.categories_spending || {})
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, amt]) => (
                              <li key={cat}>
                                {cat}: {fmt(amt)}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
