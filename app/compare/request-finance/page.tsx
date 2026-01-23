import Link from 'next/link'

export const metadata = {
  title: 'StableBill vs. Request Finance: Which is better for Stablecoin Invoicing?',
  description: 'Compare StableBill and Request Finance. See why Web3 freelancers prefer StableBill for lower fees and non-custodial security.',
}

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-5xl font-bold mb-6">StableBill vs. Request Finance</h1>
        <p className="text-xl text-white/70 mb-12">Choosing the right invoicing tool for your Web3 business. Here is how we stack up.</p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-white/10">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 border border-white/10 text-left">Feature</th>
                <th className="p-4 border border-white/10 text-left text-blue-400">StableBill</th>
                <th className="p-4 border border-white/10 text-left">Request Finance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-white/10 font-bold">Custody</td>
                <td className="p-4 border border-white/10">100% Non-Custodial</td>
                <td className="p-4 border border-white/10 text-white/50">Mixed/Managed</td>
              </tr>
              <tr>
                <td className="p-4 border border-white/10 font-bold">Setup Speed</td>
                <td className="p-4 border border-white/10">Instant (No KYC for Starter)</td>
                <td className="p-4 border border-white/10 text-white/50">KYC Required</td>
              </tr>
              <tr>
                <td className="p-4 border border-white/10 font-bold">Pricing</td>
                <td className="p-4 border border-white/10">Free up to $5k volume</td>
                <td className="p-4 border border-white/10 text-white/50">Volume-based fees</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-16 p-8 rounded-3xl bg-blue-600 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to switch to StableBill?</h2>
          <p className="mb-8 text-white/90">Get your first invoice paid in 60 seconds.</p>
          <Link href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform inline-block">
            Start for Free
          </Link>
        </div>
      </div>
    </main>
  )
}