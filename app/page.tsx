import Link from 'next/link'

export const metadata = {
  title: 'StableBill — Global Stablecoin Invoicing & Instant Settlement',
  description: 'Professional stablecoin invoicing for Web3 teams. Get paid in USDC/USDT instantly with non-custodial security. No banking delays.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="w-full flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link className="font-semibold text-lg" href="/">StableBill</Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-blue-500 hover:opacity-80">Features</a>
          <a href="#pricing" className="text-blue-500 hover:opacity-80">Pricing</a>
          <a href="#faq" className="text-blue-500 hover:opacity-80">FAQ</a>
        </nav>
        <Link className="rounded-xl bg-white px-5 py-2 font-semibold text-black hover:opacity-90" href="/signup">
          Get Started
        </Link>
      </header>

      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <h1 className="text-6xl font-bold leading-tight tracking-tighter">
          Stablecoin invoicing<br/>that feels instant.
        </h1>
        <p className="mt-6 text-xl text-white/70 max-w-xl">
          The non-custodial standard for B2B crypto payments. Get paid in USDC and settle in seconds, not days.
        </p>
        <div className="mt-10 flex gap-4">
          <Link className="rounded-xl bg-white px-8 py-4 font-bold text-black hover:scale-105 transition-transform" href="/signup">
            Get Your First Invoice Paid
          </Link>
          <a href="#features" className="rounded-xl border border-white/15 px-8 py-4 font-semibold text-blue-500 hover:bg-white/5">
            View Demo
          </a>
        </div>
      </section>

      <div className="w-full border-y border-white/5 bg-white/[0.01] py-10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 font-bold">
            Settling on the most trusted networks
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale">
             <span className="text-2xl font-black">SOLANA</span>
             <span className="text-2xl font-black">ETHEREUM</span>
             <span className="text-2xl font-black">POLYGON</span>
             <span className="text-2xl font-black">BASE</span>
             <span className="text-2xl font-black">USDC</span>
          </div>
        </div>
      </div>

      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold">Simple, Volume-Based Pricing</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3 text-left">
            <div className="rounded-3xl border border-white/10 p-8">
              <div className="text-lg font-medium text-white/50">Starter</div>
              <div className="mt-4 text-5xl font-bold">$0</div>
              <p className="mt-4 text-white/60 mb-8">Up to $5k/mo in volume. Basic reporting.</p>
              <Link className="w-full block text-center bg-white/10 text-white px-5 py-3 rounded-xl font-semibold" href="/signup">Start Free</Link>
            </div>
            <div className="rounded-3xl border-2 border-blue-500 p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
              <div className="text-lg font-medium text-white/50">Pro</div>
              <div className="mt-4 text-5xl font-bold">$29</div>
              <p className="mt-4 text-white/60 mb-8">Unlimited volume + QuickBooks sync.</p>
              <Link className="w-full block text-center bg-blue-500 text-white px-5 py-3 rounded-xl font-semibold" href="/signup">Get Pro</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
