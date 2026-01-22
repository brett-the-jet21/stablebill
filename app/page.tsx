import Link from "next/link";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Header />

      {/* HERO */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold leading-tight">
          Stablecoin invoicing<br />that feels instant.
        </h1>

        <p className="mt-6 text-lg text-white/70 max-w-xl">
          Create invoices. Get paid in stablecoins. Reconcile in seconds.
        </p>

        <div className="mt-10 flex gap-4">
          <Link
            href="/signup"
            className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Start Free
          </Link>

          <a
            href="#features"
            className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-blue-500 hover:bg-white/5"
          >
            See Features
          </a>
        </div>

        <p className="mt-6 text-sm text-white/40">
          Non-custodial · Stablecoin-native · No volatility
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Features</h2>
          <p className="mt-2 text-white/60">
            Everything you need to invoice in USD and settle in stablecoins.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-6">
              Invoice links + PDFs
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              Stablecoin payment tracking
            </div>
            <div className="rounded-2xl border border-white/10 p-6">
              Automatic reconciliation
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold">Pricing</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xl font-semibold">Starter</div>
              <div className="mt-3 text-4xl font-bold">$0</div>
              <p className="mt-2 text-white/60">Basic invoicing</p>
              <Link href="/signup" className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-xl font-semibold">
                Start Free
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xl font-semibold">Pro</div>
              <div className="mt-3 text-4xl font-bold">$29</div>
              <p className="mt-2 text-white/60">Reconciliation + exports</p>
              <Link href="/signup" className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-xl font-semibold">
                Get Pro
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <div className="text-xl font-semibold">Business</div>
              <div className="mt-3 text-4xl font-bold">$99</div>
              <p className="mt-2 text-white/60">API + advanced controls</p>
              <Link href="/signup" className="mt-6 inline-block bg-white text-black px-5 py-2 rounded-xl font-semibold">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold">FAQ</h2>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 p-6">
              <strong>Do you custody funds?</strong>
              <p className="mt-2 text-white/60">
                No. StableBill is fully non-custodial.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 p-6">
              <strong>Can I invoice in USD?</strong>
              <p className="mt-2 text-white/60">
                Yes — invoices are USD, settlement is stablecoin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
