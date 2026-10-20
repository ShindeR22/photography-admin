"use client";

import { useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";

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
}: {
  navItems: NavItem[];
  summary: string;
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
        <span className={`h-0.5 w-5 rounded bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`h-0.5 w-5 rounded bg-current transition ${open ? "opacity-0" : ""}`} />
        <span className={`h-0.5 w-5 rounded bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>
      {open && createPortal(
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[90] bg-black/45 lg:hidden"
          />
          <aside className="sidebar fixed inset-y-0 left-0 z-[100] flex w-[280px] max-w-[85vw] flex-col px-5 py-6 text-white lg:hidden" style={{ backgroundColor: "#19241d", opacity: 1 }}>
            <Link href="/" onClick={() => setOpen(false)} className="mb-10 flex items-center gap-3 px-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#d5edbd] text-[#243a27]">◉</span>
              <span>
                <span className="block text-[15px] font-semibold tracking-tight">Pune Camera</span>
                <span className="mt-0.5 block text-[11px] tracking-[.12em] text-[#a5b3a7]">PHOTOGRAPHY ASSOCIATION</span>
              </span>
            </Link>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">Workspace</p>
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
                  {item.count !== undefined && <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{item.count}</span>}
                </Link>
              ))}
            </nav>
            <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
              <p className="text-xs font-medium text-[#e1e9e2]">Pune Camera Association</p>
              <p className="mt-2 text-[11px] text-[#9ca99e]">{summary}</p>
            </div>
          </aside>
        </>
      , document.body)}
    </>
  );
}
