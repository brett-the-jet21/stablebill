"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const e = localStorage.getItem("stablebill_email");
    if (!e) router.replace("/signup");
    setEmail(e);
  }, [router]);

  if (!email) return null;

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-8">
        <h1 className="text-2xl font-semibold">Welcome</h1>
        <p className="mt-2 text-white/60">{email}</p>

        <button
          onClick={() => router.replace("/dashboard")}
          className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90"
        >
          Go to dashboard
        </button>
      </div>
    </main>
  );
}
