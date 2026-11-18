"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createPortal } from "react-dom";
import LogoutButton from "@/app/components/logout-button";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  active?: boolean;
  count?: number;
};

export default function MobileSidebar({
  navItems,
  summary,
  readOnly = false,
}: {
  navItems: NavItem[];
  summary: string;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mr-3 flex size-10 shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#e3e8e0] text-[#314c35] lg:hidden"
      >
        <span
          className={`h-0.5 w-5 rounded bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span className={`h-0.5 w-5 rounded bg-current transition ${open ? "opacity-0" : ""}`} />
        <span
          className={`h-0.5 w-5 rounded bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>
      {open &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[90] bg-black/45 lg:hidden"
            />
            <aside
              className="sidebar fixed inset-y-0 left-0 z-[100] flex w-[280px] max-w-[85vw] flex-col px-5 py-6 text-white lg:hidden"
              style={{ backgroundColor: "#19241d", opacity: 1 }}
            >
              <Link
                href="/"
                onClick={() => setOpen(false)}
                aria-label="Pune Camera Photography Association home"
                className="mb-8 flex justify-center px-2"
              >
                <Image
                  src="/pcpa-logo.png"
                  alt="Pune Camera Photography Association"
                  width={594}
                  height={420}
                  priority
                  className="h-auto w-full max-w-[158px] object-contain"
                />
              </Link>
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
                Workspace
              </p>
              <nav className="space-y-1" aria-label="Main navigation">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition ${item.active ? "bg-[#2c3a30] font-medium text-[#e3f2d9]" : "text-[#bdc8bf] hover:bg-[#253229] hover:text-white"}`}
                  >
                    <span className="w-5 text-center">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.count !== undefined && (
                      <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>
              <LogoutButton
                onLoggedOut={() => setOpen(false)}
                className="mt-3 flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] text-[#bdc8bf] transition hover:bg-[#253229] hover:text-white disabled:opacity-60"
              />
              <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
                {readOnly && <p className="mb-2 text-[10px] font-medium text-[#d7e7cc]">View-only access</p>}
                <p className="text-xs font-medium text-[#e1e9e2]">
                  Pimpri-Chinchwad Photography Association
                </p>
                <p className="mt-2 text-[11px] text-[#9ca99e]">{summary}</p>
              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}
