import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

const colors = ["sage", "peach", "blue", "lavender", "rose", "yellow"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function Home() {
  const [members, workshops, registrations] = await Promise.all([
    prisma.member.findMany({ orderBy: { joinedAt: "desc" } }),
    prisma.workshop.findMany({ orderBy: { date: "asc" } }),
    prisma.registration.findMany({ orderBy: { registeredAt: "desc" } }),
  ]);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const upcomingWorkshops = workshops.filter((workshop) => workshop.date >= now);
  const nextWorkshop = upcomingWorkshops[0];
  const activeMembers = members.filter((member) => member.status === "Active").length;
  const pendingMembers = members.filter((member) => member.status === "Pending").length;
  const paidRegistrations = registrations.filter(
    (registration) => registration.paymentStatus === "Paid",
  );
  const monthRevenue = paidRegistrations
    .filter((registration) => registration.registeredAt >= startOfMonth)
    .reduce((sum, registration) => sum + registration.amount, 0);
  const pendingPayments = registrations.filter(
    (registration) => registration.paymentStatus === "Pending",
  ).length;

  const activities = [
    ...members.map((member) => ({
      id: member.id,
      name: member.name,
      detail: "Member profile created",
      date: member.joinedAt,
      tag: "Member",
      color: colors[members.indexOf(member) % colors.length],
    })),
    ...registrations.map((registration) => ({
      id: registration.id,
      name: registration.memberName,
      detail: `Registered for ${registration.workshopTitle}`,
      date: registration.registeredAt,
      tag: "Registration",
      color: colors[registrations.indexOf(registration) % colors.length],
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const navItems = [
    { label: "Overview", href: "/", icon: "◫", active: true },
    { label: "Members", href: "/members", icon: "♧", count: members.length },
    { label: "Workshops", href: "/workshops", icon: "▦", count: workshops.length },
    { label: "Registrations", href: "/registrations", icon: "▤", count: registrations.length },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2720]">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col bg-[#19241d] px-5 py-6 text-white lg:flex">
        <Link href="/" className="mb-10 flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#d5edbd] text-[#243a27]">
            ◉
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-tight">Pune Camera</span>
            <span className="mt-0.5 block text-[11px] tracking-[.12em] text-[#a5b3a7]">
              PHOTOGRAPHY ASSOCIATION
            </span>
          </span>
        </Link>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
          Workspace
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition ${item.active ? "bg-[#2c3a30] font-medium text-[#e3f2d9]" : "text-[#bdc8bf] hover:bg-[#253229] hover:text-white"}`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">{item.count}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <p className="text-xs font-medium text-[#e1e9e2]">Database summary</p>
          <p className="mt-2 text-[11px] text-[#9ca99e]">
            {members.length} members · {workshops.length} workshops · {registrations.length}{" "}
            registrations
          </p>
        </div>
      </aside>

      <section className="lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e9ece6] bg-[#fbfcfa]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div>
            <p className="text-[11px] text-[#8b948c]">
              Association / <span className="text-[#455248]">Overview</span>
            </p>
            <p className="mt-0.5 text-sm font-semibold lg:hidden">Pune Camera Association</p>
          </div>
          <p className="hidden text-[11px] font-medium text-[#59645c] sm:block">
            {now.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[#7d8f78]">
                Association overview
              </p>
              <h1 className="text-[30px] font-semibold tracking-[-.04em] text-[#1d2a21]">
                Dashboard
              </h1>
              <p className="mt-1.5 text-[13px] text-[#7b857d]">
                Summary from your MongoDB records.
              </p>
            </div>
            <Link href="/members">
              <Button className="h-10 gap-2 rounded-lg bg-[#314c35] px-4 text-xs font-medium text-white hover:bg-[#263d2a]">
                + Add member
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric title="Total members" value={members.length} icon="♧" />
            <Metric title="Workshop registrations" value={registrations.length} icon="▦" />
            <Metric
              title="Revenue this month"
              value={`₹ ${monthRevenue.toLocaleString("en-IN")}`}
              icon="₹"
            />
            <Metric title="Pending members" value={pendingMembers} icon="◷" />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
            <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
              <CardHeader className="border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <CardTitle className="text-[14px] font-semibold">Next workshop</CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                {nextWorkshop ? (
                  <div className="rounded-xl bg-[#24362b] p-6 text-white">
                    <Badge className="border-0 bg-white/10 text-[#daedcc]">
                      {nextWorkshop.status}
                    </Badge>
                    <h2 className="mt-5 text-2xl font-semibold">{nextWorkshop.title}</h2>
                    <p className="mt-2 text-sm text-[#c0ccc1]">{nextWorkshop.description}</p>
                    <div className="mt-5 flex flex-wrap gap-5 text-xs text-[#c0ccc1]">
                      <span>{formatDate(nextWorkshop.date)}</span>
                      <span>{nextWorkshop.time}</span>
                      <span>{nextWorkshop.venue}</span>
                    </div>
                    <p className="mt-5 text-sm">Mentor: {nextWorkshop.mentorName}</p>
                    <p className="mt-1 text-sm">
                      Fee: ₹ {nextWorkshop.registrationFee.toLocaleString("en-IN")}
                    </p>
                  </div>
                ) : (
                  <EmptyState message="No upcoming workshops in the database." href="/workshops" />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
              <CardHeader className="border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <CardTitle className="text-[14px] font-semibold">Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-2 sm:px-6">
                {activities.length ? (
                  activities.map((activity) => (
                    <div
                      key={`${activity.tag}-${activity.id}`}
                      className="flex gap-3 border-b border-[#f0f2ee] py-3.5 last:border-0"
                    >
                      <Avatar label={initials(activity.name)} color={activity.color} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-[#344037]">
                          {activity.name}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-[#89938b]">
                          {activity.detail}
                        </p>
                        <p className="mt-1 text-[9px] text-[#a2aaa3]">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className="h-fit text-[9px]">
                        {activity.tag}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <EmptyState message="No recent activity in the database." href="/members" />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
            <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <CardTitle className="text-[14px] font-semibold">Recent members</CardTitle>
                <Link href="/members" className="text-[10px] font-medium text-[#597451]">
                  All members
                </Link>
              </CardHeader>
              <CardContent className="divide-y divide-[#f0f2ee] px-5">
                {members.slice(0, 5).map((member, index) => (
                  <div key={member.id} className="flex items-center gap-3 py-3.5">
                    <Avatar label={initials(member.name)} color={colors[index % colors.length]} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium">{member.name}</p>
                      <p className="mt-1 text-[10px] text-[#89938b]">
                        {member.membershipType} · {formatDate(member.joinedAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[9px]">
                      {member.status}
                    </Badge>
                  </div>
                ))}
                {!members.length && (
                  <EmptyState message="No members in the database yet." href="/members" />
                )}
              </CardContent>
            </Card>

            <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
              <CardHeader className="border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <CardTitle className="text-[14px] font-semibold">Registration payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5 sm:p-6">
                <FinanceLine
                  label="Paid"
                  count={paidRegistrations.length}
                  amount={paidRegistrations.reduce((sum, item) => sum + item.amount, 0)}
                />
                <FinanceLine
                  label="Pending"
                  count={pendingPayments}
                  amount={registrations
                    .filter((item) => item.paymentStatus === "Pending")
                    .reduce((sum, item) => sum + item.amount, 0)}
                />
                <FinanceLine
                  label="Refunded"
                  count={registrations.filter((item) => item.paymentStatus === "Refunded").length}
                  amount={registrations
                    .filter((item) => item.paymentStatus === "Refunded")
                    .reduce((sum, item) => sum + item.amount, 0)}
                />
                <p className="border-t border-[#edf0eb] pt-4 text-xs text-[#89938b]">
                  {activeMembers} active members · {upcomingWorkshops.length} upcoming workshops
                </p>
              </CardContent>
            </Card>
          </div>

          <footer className="mt-7 border-t border-[#e8ece6] pt-4 text-[9px] text-[#9ba49c]">
            Pune Camera Photography Association
          </footer>
        </div>
      </section>
    </main>
  );
}

function Metric({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
      <CardContent className="p-4 sm:p-[18px]">
        <div className="flex items-center justify-between text-[#818b82]">
          <p className="text-[11px] font-medium">{title}</p>
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#edf4e8] text-sm text-[#69875d]">
            {icon}
          </span>
        </div>
        <p className="mt-3 text-[25px] font-semibold tracking-[-.045em] text-[#26342a]">{value}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState({ message, href }: { message: string; href: string }) {
  return (
    <div className="py-8 text-center">
      <p className="text-xs text-[#89938b]">{message}</p>
      <Link href={href} className="mt-2 inline-block text-xs font-medium text-[#597451]">
        Add records
      </Link>
    </div>
  );
}

function Avatar({ label, color }: { label: string; color: string }) {
  const tones: Record<string, string> = {
    sage: "bg-[#e0ebd9] text-[#54704b]",
    peach: "bg-[#f5e3d7] text-[#96684b]",
    blue: "bg-[#e0e9f1] text-[#5e758c]",
    lavender: "bg-[#eee5f2] text-[#82678e]",
    rose: "bg-[#f4e2e5] text-[#986b75]",
    yellow: "bg-[#f3edda] text-[#927d3d]",
  };
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${tones[color]}`}
    >
      {label}
    </span>
  );
}

function FinanceLine({ label, count, amount }: { label: string; count: number; amount: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#7e8980]">
        {label} · {count}
      </span>
      <span className="font-medium text-[#455148]">₹ {amount.toLocaleString("en-IN")}</span>
    </div>
  );
}
