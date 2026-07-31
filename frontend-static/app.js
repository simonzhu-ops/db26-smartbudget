// frontend-static/app.js  — TICKET-F077

const addForm = document.getElementById("add-form");
if (addForm) {
  const message = document.getElementById("form-message");

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addForm.classList.add("was-submitted");
    message.className = "";
    message.textContent = "";

    const amount   = parseFloat(document.getElementById("amount").value);
    const date     = document.getElementById("date").value;
    const desc     = document.getElementById("description").value.trim();
    const type     = document.getElementById("type").value;
    const category = document.getElementById("category").value;

    if (isNaN(amount) || amount <= 0) return setError("Amount must be greater than 0.");
    if (!date)                        return setError("Date is required.");
    if (new Date(date) > new Date())  return setError("Date cannot be in the future.");
    if (!desc)                        return setError("Description is required.");
    if (!type)                        return setError("Choose a type.");
    if (!category)                    return setError("Choose a category.");

    submitTransaction({ amount, date, description: desc, type, category });

    function setError(text) {
      message.className = "error";
      message.textContent = text;
    }
  });
}

// frontend-static/app.js  — TICKET-F079

async function submitTransaction(payload) {
    const message = document.getElementById("form-message");
  
    try {
      const res = await fetch("http://localhost:8080/api/transactions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          user:        { userId: 1 },                 // demo: always user 1
          category:    { categoryId: idForCategory(payload.category) },
          amount:      payload.amount,
          txnDate:     payload.date,
          description: payload.description,
          type:        payload.type
        })
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || ("HTTP " + res.status));
      }
      const saved = await res.json();
  
      message.className   = "success";
      message.textContent = "Saved transaction #" + saved.txnId;
      document.getElementById("add-form").reset();
      document.getElementById("add-form").classList.remove("was-submitted");
  
    } catch (err) {
      message.className   = "error";
      message.textContent = "Could not save: " + err.message;
      // do NOT reset — user keeps their data and can retry
    }
  }
  
  const CATEGORY_IDS = {
    Salary: 1, Freelance: 2, Food: 3,
    Transport: 4, Utilities: 5,
    Entertainment: 3, Rent: 4, Other: 3,    // best-effort fallback
  };
  function idForCategory(name) { return CATEGORY_IDS[name] ?? 3; }

// frontend-static/app.js  — TICKET-F078

const rowsEl    = document.getElementById("txn-rows");
// app.js — wrap the F078 fetch
const loadingEl = document.getElementById("loading");
if (rowsEl) {
  loadingEl.hidden = false;
  rowsEl.innerHTML = "";

  fetch("http://localhost:8080/api/transactions")
    .then(res => res.json())
    .then(rows => { rowsEl.innerHTML = rows.map(toRow).join(""); })
    .catch(err => { rowsEl.innerHTML = errorRow(err); })
    .finally(() => { loadingEl.hidden = true; });
}

function toRow(t) {
  const cls = t.type === "INCOME" ? "income" : "expense";
  return `
    <tr data-id="${t.txnId}">
      <td>${t.txnId}</td>
      <td>${t.txnDate}</td>
      <td>${esc(t.description ?? "")}</td>
      <td>${esc(t.category?.name ?? "")}</td>
      <td>${t.type}</td>
      <td class="amount ${cls}">£${Number(t.amount).toFixed(2)}</td>
      <td><button class="delete-btn" data-id="${t.txnId}">Delete</button></td>
    </tr>`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

// frontend-static/app.js — TICKET-F080

const tbody = document.getElementById("txn-rows");
if (tbody) {
  tbody.addEventListener("click", handleRowClick);
}

async function handleRowClick(e) {
  const btn = e.target.closest(".delete-btn");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!confirm(`Delete transaction #${id}? This cannot be undone.`)) return;

  // Optimistic UI: disable the button while we wait
  btn.disabled    = true;
  btn.textContent = "Deleting…";

  try {
    const res = await fetch(`http://localhost:8080/api/transactions/${id}`,
                            { method: "DELETE" });
    if (!res.ok) throw new Error("HTTP " + res.status);

    // Remove the row from the DOM (no full re-fetch needed)
    btn.closest("tr").remove();
  } catch (err) {
    btn.disabled    = false;
    btn.textContent = "Delete";
    alert(`Could not delete transaction #${id}: ${err.message}`);
  }
}