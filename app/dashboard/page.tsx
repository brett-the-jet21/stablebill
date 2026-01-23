"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { safeJson } from "../lib/safeJson";

type Invoice = {
  id: string;
  token: string;
  status: string;
  customerName: string;
  customerEmail?: string | null;
  memo?: string | null;
  currency?: string | null;
  chain?: string | null;
  amountCents?: number | null;
  amount_cents?: number | null;
  amountCentsRaw?: number | null;
  amount?: any;
  amountUsd?: any;
  createdAt: string;
  paidAt?: string | null;
};

function normalizeAmountUSD(inv: any): number {
  const a = Number(inv?.amount);
  if (Number.isFinite(a) && a > 0) return a;

  const b = Number(inv?.amountUsd);
  if (Number.isFinite(b) && b > 0) return b;

  const c = Number(inv?.amount_cents ?? inv?.amountCents ?? inv?.amountCentsRaw);
  if (Number.isFinite(c) && c > 0) return c / 100;

  return 0;
}

function fmtUSDC(n: number) {
  const v = Number(n) || 0;
  return v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

function statusPill(status: string) {
  const s = (status || "").toUpperCase();
  if (s === "PAID") return { label: "Paid", cls: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30" };
  if (s === "VOID") return { label: "Void", cls: "bg-zinc-500/15 text-zinc-200 border-white/10" };
  return { label: "Unpaid", cls: "bg-amber-500/15 text-amber-200 border-amber-400/30" };
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  const [currency, setCurrency] = useState<"USDC" | "USDT">("USDC");
  const [chain, setChain] = useState<"Base" | "Ethereum" | "Solana">("Base");

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      const data = await safeJson(res);
      setInvoices(((data as any)?.invoices ?? []) || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const outstandingUSDC = useMemo(() => {
    return invoices
      .filter((i) => (i.status || "").toUpperCase() !== "PAID")
      .reduce((sum, i) => sum + normalizeAmountUSD(i), 0);
  }, [invoices]);

  async function createInvoice(e: FormEvent) {
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
          amount,
          currency,
          chain,
        }),
      });
      const data = await safeJson(res);
      if (!res.ok) throw new Error((data as any)?.error || "Failed to create invoice");

      setCustomerName("");
      setCustomerEmail("");
      setMemo("");
      setAmount("");
      setToast("Invoice created");
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); setToast("Copied"); }
    catch { setToast("Copy failed"); }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Stablecoin Billing • No chargebacks • Instant settlement
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Stable Bill Dashboard</h1>
            <p className="mt-2 text-white/60">
              Issue invoices payable in <span className="text-white">USDC</span> — settle fast.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-xs text-white/60">Outstanding</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-2xl font-semibold">{fmtUSDC(outstandingUSDC)}</div>
              <div className="text-sm text-white/70">USDC</div>
            </div>
            <div className="mt-2 text-xs text-white/50">Estimated at 1 USDC ≈ $1</div>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Create invoice</h2>
              <p className="mt-1 text-sm text-white/60">Customer pays via USDC.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <span className="text-xs text-white/60">Stablecoin</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="bg-transparent text-sm outline-none">
                  <option value="USDC">USDC</option>
                  <option value="USDT" disabled>USDT (soon)</option>
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                <span className="text-xs text-white/60">Network</span>
                <select value={chain} onChange={(e) => setChain(e.target.value as any)} className="bg-transparent text-sm outline-none">
                  <option value="Base">Base</option>
                  <option value="Ethereum" disabled>Ethereum (soon)</option>
                  <option value="Solana" disabled>Solana (soon)</option>
                </select>
              </div>
            </div>
          </div>

          <form onSubmit={createInvoice} className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-white/70">Customer name</span>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="e.g. Acme Co."
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Customer email (optional)</span>
              <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="billing@acme.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Amount (USDC)</span>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="e.g. 149.99" required
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
              />
              <span className="text-xs text-white/45">We treat USDC ≈ USD for now (perfect for MVP).</span>
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-white/70">Memo (optional)</span>
              <input value={memo} onChange={(e) => setMemo(e.target.value)}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none placeholder:text-white/30"
                placeholder="e.g. January retainer"
              />
            </label>

            <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="min-h-[20px] text-sm">
                {err ? <span className="text-rose-300">{err}</span> : toast ? <span className="text-emerald-200">{toast}</span> : null}
              </div>

              <button type="submit" disabled={creating}
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90 disabled:opacity-60"
              >
                {creating ? "Creating…" : "Create invoice"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Invoices</h2>
            <button onClick={refresh} disabled={loading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
          </div>

          <div className="mt-4 grid gap-3">
            {invoices.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                No invoices yet. Create one above to generate a payment link.
              </div>
            ) : (
              invoices.map((inv) => {
                const amt = normalizeAmountUSD(inv);
                const pill = statusPill(inv.status);
                const stable = (inv.currency || currency || "USDC").toUpperCase();
                const net = (inv.chain || chain || "Base").toString();
                const link = typeof window !== "undefined" ? `${window.location.origin}/i/${inv.token}` : `/i/${inv.token}`;

                return (
                  <div key={inv.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${pill.cls}`}>{pill.label}</span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70">{stable}</span>
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-white/70">{net}</span>
                        </div>

                        <div className="mt-2 truncate text-lg font-semibold">{inv.customerName || "Unnamed customer"}</div>
                        <div className="mt-1 text-sm text-white/60">
                          {inv.customerEmail ? inv.customerEmail : "No email"} • {inv.memo ? inv.memo : "No memo"}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:items-end">
                        <div className="text-right">
                          <div className="text-xs text-white/60">Amount</div>
                          <div className="text-xl font-semibold">
                            {fmtUSDC(amt)} <span className="text-sm font-normal text-white/70">{stable}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 md:justify-end">
                          <a href={`/i/${inv.token}`} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
                            Open checkout
                          </a>
                          <button onClick={() => copy(link)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                            Copy link
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
                      <div>Created: {fmtDate(inv.createdAt)}</div>
                      <div className="truncate">Token: {inv.token}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
