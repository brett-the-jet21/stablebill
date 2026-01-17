import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6">

        {/* NAVBAR */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/stablebill-logo.png"
              alt="StableBill"
              width={220}
              height={90}
              priority
              className="h-10 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>

          <a
            href="#"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
          >
            Get Started
          </a>
        </header>

        {/* HERO */}
        <section className="mt-20 grid gap-14 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Stablecoin invoicing that feels instant.
            </h1>

            <p className="text-lg sm:text-xl text-white/70 max-w-xl">
              Create invoices. Get paid in stablecoins. Reconcile in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold bg-white text-black hover:opacity-90"
              >
                Start Free
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold border border-white/20 hover:border-white/40"
              >
                See Features
              </a>
            </div>

            <p className="text-xs text-white/50">
              Built for founders, finance teams, and Web3-native businesses.
            </p>
          </div>

          {/* LOGO CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="text-sm text-white/60 mb-4">
              Brand preview
            </div>
            <div className="rounded-2xl bg-black/60 p-6 border border-white/10">
              <Image
                src="/brand/stablebill-logo.png"
                alt="StableBill Logo"
                width={900}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="mt-28 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Invoice in seconds",
              desc: "Generate invoices with stablecoin payment links instantly.",
            },
            {
              title: "Global settlement",
              desc: "Accept USDC & USDT worldwide without banking friction.",
            },
            {
              title: "Clean reconciliation",
              desc: "Export records your accountant will actually like.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="mt-32 border-t border-white/10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <div>© {new Date().getFullYear()} StableBill</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </footer>

      </div>
    </main>
  );
}
