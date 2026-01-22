"use client";

import { safeJson } from "../../lib/safeJson";

import { useEffect, useState } from "react";

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

export default function PublicInvoicePage({ params }: { params: { token: string } }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [payingCard, setPayingCard] = useState(false);
  const [payingUsdc, setPayingUsdc] = useState(false);

  async function load() {
    try {
      const res = await fetch(`/api/invoice-by-token/${params.token}`, { cache: "no-store" });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setInvoice(((data as any)?.invoice ?? null));
    } catch (e: any) {
      setErr(e?.message || "Failed to load invoice");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.token]);

  async function payWithStripe() {
    if (!invoice) return;
    setPayingCard(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: invoice.token }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to start checkout");
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e?.message || "Payment failed");
      setPayingCard(false);
    }
  }

  async function payWithUSDC() {
    if (!invoice) return;
    setPayingUsdc(true);
    setErr(null);
    try {
      const res = await fetch("/api/coinbase-charge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: invoice.token }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.error || "Failed to start USDC checkout");
      window.location.href = data.hostedUrl;
    } catch (e: any) {
      setErr(e?.message || "USDC payment failed");
      setPayingUsdc(false);
    }
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>Invoice</h1>

      {err ? <p style={{ color: "tomato" }}>{err}</p> : null}
      {!invoice && !err ? <p style={{ opacity: 0.8 }}>Loading…</p> : null}

      {invoice ? (
        <section style={{ marginTop: 14, padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <div>
              <div style={{ opacity: 0.8, fontSize: 13 }}>Billed to</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{invoice.customerName}</div>
              {invoice.customerEmail ? <div style={{ opacity: 0.75 }}>{invoice.customerEmail}</div> : null}
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ opacity: 0.8, fontSize: 13 }}>Amount due</div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{money(invoice.amountCents)}</div>
              <div style={{ opacity: 0.85 }}>
                Status: <b>{invoice.status}</b>
              </div>
            </div>
          </div>

          {invoice.memo ? (
            <div style={{ marginTop: 12, opacity: 0.9 }}>
              <div style={{ opacity: 0.8, fontSize: 13 }}>Memo</div>
              <div>{invoice.memo}</div>
            </div>
          ) : null}

          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={payWithStripe} disabled={payingCard || invoice.status === "PAID"}>
              {invoice.status === "PAID" ? "Paid ✅" : payingCard ? "Redirecting…" : "Pay with card (Stripe)"}
            </button>

            <button onClick={payWithUSDC} disabled={payingUsdc || invoice.status === "PAID"}>
              {invoice.status === "PAID" ? "Paid ✅" : payingUsdc ? "Redirecting…" : "Pay with USDC (Coinbase)"}
            </button>

            <button onClick={() => navigator.clipboard.writeText(window.location.href)} type="button">
              Copy link
            </button>
          </div>

          <div style={{ marginTop: 12, opacity: 0.75, fontSize: 13 }}>
            Created: {new Date(invoice.createdAt).toLocaleString()}
            {invoice.paidAt ? ` • Paid: ${new Date(invoice.paidAt).toLocaleString()}` : ""}
          </div>
        </section>
      ) : null}

      <style jsx global>{`
        button {
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.16);
          padding: 10px 12px;
          background: rgba(255,255,255,0.08);
          color: inherit;
          cursor: pointer;
          font-weight: 700;
        }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </main>
  );
}
