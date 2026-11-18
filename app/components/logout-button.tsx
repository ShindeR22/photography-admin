"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({
  className,
  onLoggedOut,
}: {
  className: string;
  onLoggedOut?: () => void;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      onLoggedOut?.();
      router.replace("/login");
      router.refresh();
    } catch {
      setPending(false);
    }
  }

  return (
    <button type="button" onClick={logout} disabled={pending} className={className}>
      <span className="w-5 text-center">↪</span>
      <span>{pending ? "बाहेर पडत आहे…" : "Logout"}</span>
    </button>
  );
}
