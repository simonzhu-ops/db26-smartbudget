// src/components/FilterBar.jsx
import "./FilterBar.css";

export default function FilterBar({
  typeFilter, setTypeFilter,
  from, setFrom, to, setTo,
  search, setSearch,
  visibleCount, totalCount,
}) {
  function clearAll() {
    setTypeFilter("ALL");
    setFrom(""); setTo("");
    setSearch("");
  }
  const hasFilters = typeFilter !== "ALL" || from || to || search;

  return (
    <div className="filter-bar" role="search">
      <label>
        Type
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </label>
      <label>
        From <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
      </label>
      <label>
        To <input type="date" value={to}   onChange={e => setTo(e.target.value)} />
      </label>
      <label className="grow">
        Search
        <input type="search" placeholder="Description contains…"
               value={search} onChange={e => setSearch(e.target.value)} />
      </label>
      <button onClick={clearAll} disabled={!hasFilters}>
        Clear filters
      </button>
      <span className="count">
        Showing <b>{visibleCount}</b> of <b>{totalCount}</b>
      </span>
    </div>
  );
}