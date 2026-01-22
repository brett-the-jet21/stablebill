"use client";

import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("stablebill_email", email);
    setDone(true);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 p-8">
        <h1 className="text-3xl font-semibold">Create your workspace</h1>
        <p className="mt-2 text-white/60">
          No wallet required to start.
        </p>

        {done ? (
          <div className="mt-6 rounded-xl border border-white/10 p-4">
            <strong>You're in.</strong>
            <p className="mt-2 text-white/60 text-sm">{email}</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 outline-none"
            />

            <button className="w-full rounded-xl bg-white px-5 py-3 font-semibold text-black hover:opacity-90">
              Start free
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
