import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-5 border-b border-white/10">
      <Link href="/" className="font-semibold text-lg">
        StableBill
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm">
        <a href="#features" className="text-blue-500 hover:opacity-80">Features</a>
        <a href="#pricing" className="text-blue-500 hover:opacity-80">Pricing</a>
        <a href="#faq" className="text-blue-500 hover:opacity-80">FAQ</a>
      </nav>

      <Link
        href="/signup"
        className="rounded-xl bg-white px-5 py-2 font-semibold text-black hover:opacity-90"
      >
        Get Started
      </Link>
    </header>
  );
}
