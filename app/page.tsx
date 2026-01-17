"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-xl font-bold tracking-tight">StableBill</div>
        <div className="flex items-center gap-4">
          <Link
            href="#how"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            How it works
          </Link>
          <Link
            href="#faq"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            FAQ
          </Link>
          <Link
            href="/create-invoice"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Create invoice
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Stablecoin invoicing
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight tracking-tight">
            Get paid in stablecoins.
            <br />
            <span className="text-zinc-500">Without banks.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-zinc-600">
            Send invoices. Get paid in USDC. No borders, no chargebacks, no
            custody.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              href="/create-invoice"
              className="rounded-full bg-zinc-900 px-7 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Create invoice
            </Link>
            <Link
              href="#how"
              className="rounded-full border border-zinc-200 px-7 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Non-custodial</div>
              <div className="mt-1 text-zinc-600">Funds go straight to you</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Instant</div>
              <div className="mt-1 text-zinc-600">Paid in minutes</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="font-semibold">Global</div>
              <div className="mt-1 text-zinc-600">Any country, anytime</div>
            </div>
          </div>
        </div>

        {/* Invoice mock */}
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 shadow-sm">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Invoice</span>
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium">
                USDC
              </span>
            </div>

            <div className="mt-6">
              <div className="text-4xl font-extrabold">$2,400.00</div>
              <div className="mt-1 text-sm text-zinc-600">
                Software consulting – March
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span className="text-zinc-600">Network</span>
                <span className="font-medium">Ethereum / Solana</span>
              </div>
              <div className="flex justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <span className="text-zinc-600">Due</span>
                <span className="font-medium">Upon receipt</span>
              </div>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
              Pay invoice
            </button>

            <p className="mt-3 text-center text-xs text-zinc-500">
              UI preview — payments wired next
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 p-6">
              <div className="font-semibold">1. Create</div>
              <p className="mt-2 text-sm text-zinc-600">
                Enter amount, memo, and receiving wallet.
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-6">
              <div className="font-semibold">2. Send</div>
              <p className="mt-2 text-sm text-zinc-600">
                Share the invoice link anywhere.
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-6">
              <div className="font-semibold">3. Get paid</div>
              <p className="mt-2 text-sm text-zinc-600">
                Client pays in USDC. You receive instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold">FAQ</h2>
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-zinc-200 p-6">
              <div className="font-semibold">Do you hold funds?</div>
              <p className="mt-2 text-sm text-zinc-600">
                No. StableBill is non-custodial. Funds go directly to your wallet.
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-6">
              <div className="font-semibold">What do you support?</div>
              <p className="mt-2 text-sm text-zinc-600">
                Starting with USDC. More assets later.
              </p>
            </div>
          </div>

          <footer className="mt-16 flex justify-between text-xs text-zinc-500">
            <span>© {new Date().getFullYear()} StableBill</span>
            <span>Stablecoin rails, simplified</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
