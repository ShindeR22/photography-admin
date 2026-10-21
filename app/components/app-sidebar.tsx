import Image from "next/image";
import Link from "next/link";

export type SidebarRoute = "overview" | "members" | "workshops" | "registrations";

export default function AppSidebar({
  activeRoute,
  counts,
}: {
  activeRoute: SidebarRoute;
  counts: Partial<{ members: number; workshops: number; registrations: number }>;
}) {
  const items = [
    { label: "Overview", href: "/", route: "overview", icon: "◫" },
    { label: "Members", href: "/members", route: "members", icon: "♧", count: counts.members },
    { label: "Workshops", href: "/workshops", route: "workshops", icon: "▦", count: counts.workshops },
    { label: "Registrations", href: "/registrations", route: "registrations", icon: "▤", count: counts.registrations },
  ] as const;

  return (
    <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col bg-[#19241d] px-5 py-6 text-white lg:flex">
      <Link href="/" aria-label="Pune Camera Photography Association home" className="mb-8 flex justify-center px-2">
        <Image src="/pcpa-logo.png" alt="Pune Camera Photography Association" width={594} height={420} priority className="h-auto w-full max-w-[148px] object-contain" />
      </Link>
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">Workspace</p>
      <nav className="space-y-1" aria-label="Main navigation">
        {items.map((item) => (
          <Link
            key={item.route}
            href={item.href}
            aria-current={activeRoute === item.route ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition ${activeRoute === item.route ? "bg-[#2c3a30] font-medium text-[#e3f2d9]" : "text-[#bdc8bf] hover:bg-[#253229] hover:text-white"}`}
          >
            <span className="w-5 text-center">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {"count" in item && item.count !== undefined && <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{item.count}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
        <p className="text-xs font-medium text-[#e1e9e2]">Pune Camera Association</p>
        <p className="mt-2 text-[11px] text-[#9ca99e]">
          {[
            counts.members !== undefined && `${counts.members} members`,
            counts.workshops !== undefined && `${counts.workshops} workshops`,
            counts.registrations !== undefined && `${counts.registrations} registrations`,
          ].filter(Boolean).join(" · ")}
        </p>
      </div>
    </aside>
  );
}
