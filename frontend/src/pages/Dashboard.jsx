import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// ============================================================
// Dashboard — the landing page of SmartBudget
// ============================================================
//
// DAY 1 (provided): Shows a welcome message + fetches /api/categories
//   as "proof-of-life" — confirming the backend is running and API works.
//
// TICKET-F085 (Day 8, Sprint 7): Build the full dashboard with:
//   - Summary stat cards (Total Income, Total Expenses, Balance, Count)
//   - Loading spinner while data fetches
//   - Error message if backend is down
//
// TICKET-F100 (Day 9, Sprint 8): Add a monthly summary bar chart
//
// ============================================================

export default function Dashboard() {
  const [categories, setCategories] = useState([])
  const [status, setStatus]         = useState('loading')

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { setCategories(data); setStatus('ok') })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Dashboard</h1>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
        Welcome to <strong>SmartBudget</strong> — your personal finance tracker.
      </p>

      {/* Day 1 proof-of-life: verify API connectivity */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>API Status</h3>
        {status === 'loading' && <p>Connecting to backend...</p>}
        {status === 'error'   && <p style={{ color: 'var(--danger)' }}>Backend not running. Start with: mvn spring-boot:run</p>}
        {status === 'ok' && (
          <>
            <p style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Connected — {categories.length} categories loaded</p>
            <ul style={{ paddingLeft: '1.2rem' }}>
              {categories.map(c => (
                <li key={c.categoryId}>{c.name} <span className={`badge badge--${c.type?.toLowerCase()}`}>{c.type}</span></li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* ------------------------------------------------------- */}
      {/* TODO TICKET-F085 (Day 8): Add summary stat cards         */}
      {/* ------------------------------------------------------- */}
      {/*
        WHAT: Stat cards show key financial metrics at a glance:
              Total Income, Total Expenses, Balance, and Transaction Count.

        HOW:  1. Import useTransactionData() from hooks/useBudgetAPI.js
              2. Call it at the top of the component to get { transactions, loading, error }
              3. Use useMemo (import from 'react') to calculate:
                 - income:   sum of all transactions where type === 'INCOME'
                 - expenses: sum of all transactions where type === 'EXPENSE'
                 - balance:  income - expenses
                 - count:    transactions.length
              4. Create a StatCard helper function that renders a card with label and value
              5. Render 4 StatCards in a grid layout (CSS grid or flexbox)
              6. Show the Spinner component (from components/Feedback.jsx) while loading
              7. Show the ErrorMessage component on error

        WHY:  The dashboard is the first thing users see. Summary metrics give an
              instant overview of financial health. useMemo caches the calculations
              so they only re-run when transactions change, not on every render.

        OBSERVE: After implementing, the dashboard should show 4 colored stat cards.
                 Total Income should be green, Total Expenses red, Balance primary color.
                 The numbers should match what you see in GET /api/transactions.
      */}

import { useMemo } from "react";

const MOCK_TRANSACTIONS = [
  { txnId: 1, type: "INCOME",  amount: 3500.00 },
  { txnId: 2, type: "EXPENSE", amount:   45.20 },
  { txnId: 3, type: "EXPENSE", amount:   25.00 },
  { txnId: 4, type: "INCOME",  amount: 4200.00 },
];

export default function Dashboard() {
  const txns = MOCK_TRANSACTIONS;   // F091 will replace with useTransactionData()

  const totals = useMemo(() => {
    let income = 0, expenses = 0;
    for (const t of txns) {
      if (t.type === "INCOME")  income   += Number(t.amount);
      if (t.type === "EXPENSE") expenses += Number(t.amount);
    }
    return { income, expenses, net: income - expenses };
  }, [txns]);

  const fmt = n => "£" + n.toFixed(2);

  return (
    <main style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
      <h2>Dashboard</h2>
      <section
        style={{ display: "grid",
                 gridTemplateColumns: "repeat(3, 1fr)",
                 gap: "1rem" }}>
        <Card label="Total Income"   value={fmt(totals.income)}   color="green" />
        <Card label="Total Expenses" value={fmt(totals.expenses)} color="red" />
        <Card label="Net Balance"    value={fmt(totals.net)}
              color={totals.net < 0 ? "red" : "blue"} />
      </section>
    </main>
  );
}

function Card({ label, value, color }) {
  const palette = { green: "#2e7d32", red: "#c62828", blue: "#003366" };
  return (
    <article style={{ background: "#fff", padding: "1.25rem",
                      borderRadius: 8, boxShadow: "0 1px 4px rgba(0,0,0,.08)" }}>
      <h3 style={{ margin: 0, color: "#666", fontSize: ".9rem" }}>{label}</h3>
      <p style={{ margin: ".5rem 0 0", fontSize: "1.75rem",
                  fontWeight: 600, color: palette[color] }}>{value}</p>
    </article>
  );
}




      {/* ------------------------------------------------------- */}
      {/* TODO TICKET-F100 (Day 9): Add monthly summary chart      */}
      {/* ------------------------------------------------------- */}
      {/*
        WHAT: A bar chart showing income vs. expenses per month.

        HOW:  1. Import MonthlySummaryChart from components/MonthlySummaryChart.jsx
              2. Pass the transactions array as a prop:
                 <MonthlySummaryChart transactions={transactions} />
              3. Place it below the stat cards

        WHY:  Charts reveal trends that raw numbers don't show.
              "Am I spending more each month?" is hard to answer from a table.

        OBSERVE: A bar chart should appear with green (income) and red (expense) bars.
      */}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/add"          className="btn btn-primary">+ Add Transaction</Link>
        <Link to="/transactions" className="btn btn-secondary">View Transactions</Link>
        <Link to="/savings"      className="btn btn-secondary">Savings Goals</Link>
      </div>
    </div>
  )
}
