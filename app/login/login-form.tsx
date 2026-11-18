"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: form.get("id"), password: form.get("password") }),
      });
      if (!response.ok) {
        setError("ID किंवा password चुकीचा आहे. पुन्हा प्रयत्न करा.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("लॉग इन करताना अडचण आली. पुन्हा प्रयत्न करा.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-5">
      <div>
        <label htmlFor="id" className="mb-2 block text-xs font-medium text-[#465248]">Login ID</label>
        <input id="id" name="id" type="text" inputMode="numeric" autoComplete="username" required className="h-12 w-full rounded-lg border border-[#e1e7de] bg-[#fbfcfa] px-3.5 text-sm outline-none transition placeholder:text-[#a5ada6] focus:border-[#71866a] focus:ring-4 focus:ring-[#71866a]/10" placeholder="तुमचा ID टाका" />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-xs font-medium text-[#465248]">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="h-12 w-full rounded-lg border border-[#e1e7de] bg-[#fbfcfa] px-3.5 text-sm outline-none transition placeholder:text-[#a5ada6] focus:border-[#71866a] focus:ring-4 focus:ring-[#71866a]/10" placeholder="तुमचा password टाका" />
      </div>
      {error && <p role="alert" className="rounded-lg bg-[#fff1ee] px-3 py-2.5 text-xs text-[#a4473b]">{error}</p>}
      <button disabled={pending} className="flex h-12 w-full items-center justify-center rounded-lg bg-[#314c35] text-sm font-medium text-white transition hover:bg-[#263d2a] disabled:cursor-wait disabled:opacity-70">
        {pending ? "लॉग इन होत आहे…" : "लॉग इन करा"}
      </button>
    </form>
  );
}
