import { useState, useEffect, useCallback } from 'react'

// ============================================================
// TICKET-F091 (Day 8, Sprint 7) — Custom React Hooks for API Calls
// ============================================================
//
// WHAT: Custom hooks are reusable functions that encapsulate React logic.
//       Each hook below handles a specific API call and manages three states:
//         - data (the fetched result — transactions, goals, or categories)
//         - loading (true while the fetch is in progress)
//         - error (an error message if the fetch failed)
//       Custom hooks MUST start with "use" — this is a React naming convention.
//       React treats functions starting with "use" specially.
//
// WHY:  Without custom hooks, every page component would repeat the same
//       fetch + loading + error logic. That violates DRY (Don't Repeat Yourself).
//       With hooks, each page simply calls: const { data, loading, error } = useMyHook()
//       and the hook handles everything internally.
//
// KEY CONCEPTS:
//   useState()    → Creates a state variable that triggers re-render when changed
//   useEffect()   → Runs code AFTER the component renders (side effects like API calls)
//   useCallback() → Memoizes a function so it doesn't get recreated on every render
//   fetch()       → The browser's built-in API for making HTTP requests
//   async/await   → Modern JavaScript syntax for handling asynchronous operations
//
// HOW HOOKS WORK TOGETHER:
//   1. Component mounts → useEffect runs → calls fetchData()
//   2. fetchData() sets loading=true, calls the API, sets data, sets loading=false
//   3. Component re-renders with the new data
//   4. If the API fails, error is set instead of data
//   5. refetch() allows the component to manually trigger a re-fetch (e.g., after a delete)
//
// ============================================================
function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => { if (!cancelled) setData(json); })
      .catch(err  => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Cleanup: if the component unmounts before fetch settles,
    // don't call setState (avoids the React warning).
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// -------------------------------------------------------
// TODO TICKET-F091: Step 1 — Implement useTransactionData()
// -------------------------------------------------------
// WHAT: Fetches ALL transactions from GET /api/transactions.
//       Returns { transactions, loading, error, refetch }.
//
// HOW:  Inside the function:
//       1. Create three state variables using useState:
//          - transactions (starts as empty array [])
//          - loading (starts as true)
//          - error (starts as null)
//       2. Create a fetchData function wrapped in useCallback:
//          - Set loading to true and error to null
//          - Use fetch('/api/transactions') to call the API
//          - If the response is OK, parse the JSON and set transactions
//          - If the response is NOT OK, set error to a message
//          - Use try/catch to handle network errors (fetch fails if server is down)
//          - Set loading to false in a finally block
//       3. Call fetchData inside useEffect with [fetchData] as the dependency array
//          (this means: "run fetchData when the component mounts")
//       4. Return an object: { transactions, loading, error, refetch: fetchData }
//
// WHY:  useCallback prevents fetchData from being recreated on every render.
//       Without it, useEffect would see a "new" function each time and re-fetch
//       in an infinite loop. The dependency array [fetchData] ensures useEffect
//       only runs when fetchData actually changes (which is never, thanks to useCallback).
//
// OBSERVE: Import this hook in TransactionList.jsx. While loading, you should see
//          a spinner. After loading, you should see transaction data.
//          If the backend is down, you should see an error message.
export function useTransactionData() {
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/transactions')
      if (!res.ok) throw new Error(`Failed to load transactions (HTTP ${res.status})`)
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  return { transactions, loading, error, refetch: fetchData }
}


// -------------------------------------------------------
// TICKET-F091: Step 2 — useSavingsGoals(userId)
// -------------------------------------------------------
// Fetches savings goals for a specific user from GET /api/goals/user/{userId}.
// Returns { goals, loading, error, refetch }.
export function useSavingsGoals(userId) {
  const [goals,   setGoals]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/goals/user/${userId}`)
      if (!res.ok) throw new Error(`Failed to load goals (HTTP ${res.status})`)
      const data = await res.json()
      setGoals(data)
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchData() }, [fetchData])

  return { goals, loading, error, refetch: fetchData }
}


// -------------------------------------------------------
// TICKET-F091: Step 3 — useCategories()
// -------------------------------------------------------
// Fetches all categories from GET /api/categories.
// Returns just the categories array — categories rarely change,
// so we skip the loading/error surface (the AddTransactionForm
// happily renders an empty dropdown while the fetch is in flight).
export function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/categories')
      .then(res => (res.ok ? res.json() : []))
      .then(data => { if (!cancelled) setCategories(data) })
      .catch(() => { /* silently ignore — dropdown just stays empty */ })
    return () => { cancelled = true }
  }, [])

  return categories
}