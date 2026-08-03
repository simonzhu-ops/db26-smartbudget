import { useTransactionData } from "../hooks/useBudgetAPI";
import TransactionRow from "../components/TransactionRow";
import { Spinner, ErrorMessage } from "../components/Feedback";
import { useState, useMemo } from "react";
import FilterBar from "../components/FilterBar";

export default function TransactionList() {
  const { data: txns = [], loading, error } = useTransactionData();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [from,       setFrom]       = useState("");
  const [to,         setTo]         = useState("");
  const [search,     setSearch]     = useState("");

  if (loading) return <Spinner />;
  if (error)   return <ErrorMessage message={error.message} />;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return txns
      .filter(t => typeFilter === "ALL" || t.type === typeFilter)
      .filter(t => !from || t.txnDate >= from)
      .filter(t => !to   || t.txnDate <= to)
      .filter(t => !q    || (t.description ?? "").toLowerCase().includes(q));
  }, [txns, typeFilter, from, to, search]);

  return (
    <main className="page">
      <h2>Transactions</h2>
  
      <FilterBar
      typeFilter={typeFilter} setTypeFilter={setTypeFilter}
      from={from} setFrom={setFrom}
      to={to} setTo={setTo}
      search={search} setSearch={setSearch}
      visibileCount={filtered.length}
      totalCount={txns.length}
      />
  
  <table>
        <thead><tr><th>Date</th><th>Description</th><th>Category</th>
                   <th>Type</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          {filtered.length === 0
            ? <tr><td colSpan="6">No transactions match this filter.</td></tr>
            : filtered.map(t =>
                <TransactionRow key={t.txnId} txn={t}
                                onDelete={id => console.log("delete", id)} />)}
        </tbody>
      </table>
    </main>
  );
}
