"use client";

import { safeJson } from "../lib/safeJson";

import { useEffect, useMemo, useState } from "react";

type Invoice = {
  id: string;
  token: string;
  status: string;
  customerName: string;
  customerEmail?: string | null;
  memo?: string | null;
  currency: string;
  amountCents: number;
  createdAt: string;
  paidAt?: string | null;
};

function money(cents: number) {
  return (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      const data = await safeJson(res);
      setInvoices(data.invoices || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const totalOutstanding = useMemo(() => {
    return invoices
      .filter((i) => i.status !== "PAID")
      .reduce((sum, i) => sum + i.amountCents, 0);
  }, [invoices]);

  async function createInvoice(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setErr(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail: customerEmail || null,
          memo: memo || null,
          amount: amount,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to create invoice");

      setCustomerName("");
      setCustomerEmail("");
      setMemo("");
      setAmount("");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <h1 style={{ margin: 0, fontSize: 28 }}>Stable Bill Dashboard</h1>
        <div style={{ opacity: 0.85 }}>
          Outstanding: <b>{money(totalOutstanding)}</b>
        </div>
      </div>

      <section style={{ marginTop: 18, padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Create invoice</h2>

        <form onSubmit={createInvoice} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span>Customer name</span>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Customer email (optional)</span>
            <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Amount (USD)</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="e.g. 149.99" required />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span>Memo (optional)</span>
            <input value={memo} onChange={(e) => setMemo(e.target.value)} />
          </label>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10, alignItems: "center" }}>
            <button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create invoice"}
            </button>
            {err ? <span style={{ color: "tomato" }}>{err}</span> : null}
          </div>
        </form>
      </section>

      <section style={{ marginTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Invoices</h2>
          <button onClick={refresh} disabled={loading}>{loading ? "Loading..." : "Refresh"}</button>
        </div>

        <div style={{ marginTop: 10, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 160px 110px 220px", padding: "10px 12px", fontWeight: 600, opacity: 0.9, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
            <div>Status</div>
            <div>Customer</div>
            <div>Amount</div>
            <div>Link</div>
            <div>Created</div>
          </div>

          {invoices.length === 0 && !loading ? (
            <div style={{ padding: 14, opacity: 0.8 }}>No invoices yet.</div>
          ) : null}

          {invoices.map((inv) => (
            <div key={inv.id} style={{ display: "grid", gridTemplateColumns: "140px 1fr 160px 110px 220px", padding: "10px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div><b>{inv.status}</b></div>
              <div>
                <div style={{ fontWeight: 600 }}>{inv.customerName}</div>
                {inv.customerEmail ? <div style={{ opacity: 0.75, fontSize: 13 }}>{inv.customerEmail}</div> : null}
              </div>
              <div style={{ fontWeight: 700 }}>{money(inv.amountCents)}</div>
              <div>
                <a href={`/i/${inv.token}`} target="_blank" rel="noreferrer">Open</a>
              </div>
              <div style={{ opacity: 0.8 }}>
                {new Date(inv.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style jsx global>{`
        input, button {
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.16);
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          color: inherit;
          outline: none;
        }
        button {
          cursor: pointer;
          background: rgba(255,255,255,0.08);
          font-weight: 600;
        }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        a { color: inherit; }
      `}</style>
    </main>
  );
}
