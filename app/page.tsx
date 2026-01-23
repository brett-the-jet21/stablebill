import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-6 md:px-12 lg:px-24 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight">
          Global Stablecoin Invoicing
          <br />
          <span className="text-indigo-600">Instant • Stable • Simple</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Send invoices in USDC across Solana, Ethereum, Polygon & Base. Get paid instantly with zero volatility. No wallet needed to start.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xl rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
            onClick={() => window.location.href = '/signup'}
          >
            Start Free – No Wallet Required
          </motion.button>

          <Link
            href="/signup"
            className="px-10 py-5 border-2 border-indigo-500 text-indigo-600 font-bold text-xl rounded-2xl hover:bg-indigo-50 hover:border-indigo-600 transition-all duration-300"
          >
            Get Pro Plan
          </Link>
        </div>

        {/* Networks / Trust */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 opacity-80">
          <span className="text-lg font-medium text-gray-700">Powered by Solana • Ethereum • Polygon • Base</span>
        </div>
      </section>

      {/* Pricing placeholder - expand later */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Card */}
          <div className="p-8 border rounded-2xl shadow-lg hover:shadow-2xl transition">
            <h3 className="text-2xl font-bold">Starter</h3>
            <p className="text-4xl font-extrabold mt-4">$0<span className="text-xl font-normal"> /mo</span></p>
            <p className="text-gray-600 mt-2">Up to $5,000 monthly volume</p>
            <ul className="mt-6 space-y-3">
              <li>✓ Basic invoicing</li>
              <li>✓ Multi-chain support</li>
            </ul>
            <button className="mt-8 w-full py-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-900 transition">
              Choose Starter
            </button>
          </div>

          {/* Pro Card */}
          <div className="p-8 border-2 border-indigo-500 rounded-2xl shadow-2xl relative">
            <span className="absolute -top-3 right-6 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</span>
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="text-4xl font-extrabold mt-4">$29<span className="text-xl font-normal"> /mo</span></p>
            <p className="text-gray-600 mt-2">Unlimited volume + integrations</p>
            <ul className="mt-6 space-y-3">
              <li>✓ QuickBooks sync</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced analytics</li>
            </ul>
            <button className="mt-8 w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition">
              Get Pro
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
