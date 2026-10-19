"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Registration = {
  id: string;
  name: string;
  email: string;
  memberId: string;
  workshop: string;
  date: string;
  amount: number;
  payment: "Paid" | "Pending" | "Refunded";
  attendance: "Registered" | "Attended" | "Waitlist";
  avatar: string;
  tone: string;
};

const initialRegistrations: Registration[] = [
  {
    id: "REG-0108",
    name: "Mira Kulkarni",
    email: "mira.kulkarni@gmail.com",
    memberId: "PCA-0247",
    workshop: "The art of street photography",
    date: "17 Oct, 2026",
    amount: 1200,
    payment: "Paid",
    attendance: "Registered",
    avatar: "MK",
    tone: "peach",
  },
  {
    id: "REG-0107",
    name: "Aarav Deshmukh",
    email: "aarav.deshmukh@gmail.com",
    memberId: "PCA-0248",
    workshop: "The art of street photography",
    date: "17 Oct, 2026",
    amount: 1200,
    payment: "Paid",
    attendance: "Registered",
    avatar: "AD",
    tone: "sage",
  },
  {
    id: "REG-0106",
    name: "Rohan Patil",
    email: "rohan.patil@gmail.com",
    memberId: "PCA-0246",
    workshop: "The art of street photography",
    date: "16 Oct, 2026",
    amount: 1200,
    payment: "Pending",
    attendance: "Registered",
    avatar: "RP",
    tone: "blue",
  },
  {
    id: "REG-0105",
    name: "Ananya Shah",
    email: "ananya.shah@gmail.com",
    memberId: "PCA-0245",
    workshop: "Portraits in natural light",
    date: "15 Oct, 2026",
    amount: 1500,
    payment: "Paid",
    attendance: "Registered",
    avatar: "AS",
    tone: "lavender",
  },
  {
    id: "REG-0104",
    name: "Neha Shah",
    email: "neha.shah@gmail.com",
    memberId: "PCA-0244",
    workshop: "The art of street photography",
    date: "14 Oct, 2026",
    amount: 1200,
    payment: "Paid",
    attendance: "Waitlist",
    avatar: "NS",
    tone: "rose",
  },
  {
    id: "REG-0103",
    name: "Kabir Joshi",
    email: "kabir.joshi@gmail.com",
    memberId: "PCA-0243",
    workshop: "Portraits in natural light",
    date: "12 Oct, 2026",
    amount: 1500,
    payment: "Pending",
    attendance: "Registered",
    avatar: "KJ",
    tone: "yellow",
  },
  {
    id: "REG-0102",
    name: "Ishita Rao",
    email: "ishita.rao@gmail.com",
    memberId: "PCA-0242",
    workshop: "Mastering manual mode",
    date: "02 Oct, 2026",
    amount: 800,
    payment: "Refunded",
    attendance: "Attended",
    avatar: "IR",
    tone: "blue",
  },
  {
    id: "REG-0101",
    name: "Devika Nair",
    email: "devika.nair@gmail.com",
    memberId: "PCA-0241",
    workshop: "Mastering manual mode",
    date: "01 Oct, 2026",
    amount: 800,
    payment: "Paid",
    attendance: "Attended",
    avatar: "DN",
    tone: "peach",
  },
  {
    id: "REG-0100",
    name: "Siddharth Mehta",
    email: "siddharth.mehta@gmail.com",
    memberId: "PCA-0240",
    workshop: "The art of street photography",
    date: "29 Sep, 2026",
    amount: 1200,
    payment: "Paid",
    attendance: "Registered",
    avatar: "SM",
    tone: "sage",
  },
  {
    id: "REG-0099",
    name: "Priya Kulkarni",
    email: "priya.kulkarni@gmail.com",
    memberId: "PCA-0239",
    workshop: "Portraits in natural light",
    date: "28 Sep, 2026",
    amount: 1500,
    payment: "Pending",
    attendance: "Registered",
    avatar: "PK",
    tone: "lavender",
  },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    users: (
      <>
        <path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20" />
        <circle cx="9.5" cy="7" r="4" />
        <path d="M20.5 20v-1.5a4 4 0 0 0-3-3.87M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 7a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4h16v-4a2 2 0 0 1 0-4V5H4z" />
        <path d="M13 5v2M13 11v2M13 17v2" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 9h18M16 14h2" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19 13 2 1-2 4-2-1-2 1v2H9v-2l-2-1-2 1-2-4 2-1v-2l-2-1 2-4 2 1 2-1V4h6v2l2 1 2-1 2 4-2 1z" />
      </>
    ),
    camera: (
      <>
        <path d="M14 4H9L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-8" />
        <path d="M15 7h6v6" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] ?? paths.ticket}
    </svg>
  );
}

export default function RegistrationsDirectory() {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [query, setQuery] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("All workshops");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [tab, setTab] = useState("All registrations");
  const [notice, setNotice] = useState("");

  const workshops = Array.from(new Set(registrations.map((registration) => registration.workshop)));
  const filtered = useMemo(
    () =>
      registrations.filter((registration) => {
        const needle = query.trim().toLowerCase();
        const matchesSearch =
          !needle ||
          [
            registration.name,
            registration.email,
            registration.id,
            registration.memberId,
            registration.workshop,
          ].some((value) => value.toLowerCase().includes(needle));
        const matchesWorkshop =
          workshopFilter === "All workshops" || registration.workshop === workshopFilter;
        const matchesPayment =
          paymentFilter === "All payments" || registration.payment === paymentFilter;
        const matchesTab =
          tab === "All registrations" ||
          (tab === "Needs attention" && registration.payment === "Pending") ||
          (tab === "Attended" && registration.attendance === "Attended");
        return matchesSearch && matchesWorkshop && matchesPayment && matchesTab;
      }),
    [registrations, query, workshopFilter, paymentFilter, tab],
  );

  function updatePayment(id: string) {
    setRegistrations((current) =>
      current.map((registration) =>
        registration.id === id ? { ...registration, payment: "Paid" } : registration,
      ),
    );
    setNotice("Payment marked as received");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function markAttendance(id: string) {
    setRegistrations((current) =>
      current.map((registration) =>
        registration.id === id ? { ...registration, attendance: "Attended" } : registration,
      ),
    );
    setNotice("Attendance marked");
    window.setTimeout(() => setNotice(""), 2600);
  }

  const pendingPayments = registrations.filter(
    (registration) => registration.payment === "Pending",
  ).length;
  const totalRevenue = registrations
    .filter((registration) => registration.payment === "Paid")
    .reduce((sum, registration) => sum + registration.amount, 0);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2720]">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col bg-[#19241d] px-5 py-6 text-white lg:flex">
        <Link href="/" className="mb-10 flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#d5edbd] text-[#243a27]">
            <Icon name="camera" size={21} />
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
          <NavItem href="/" label="Overview" icon="grid" />
          <NavItem href="/members" label="Members" icon="users" count="248" />
          <NavItem href="/workshops" label="Workshops" icon="calendar" />
          <NavItem href="/registrations" label="Registrations" icon="ticket" count="12" active />
          <NavItem href="/#accounts" label="Accounts" icon="wallet" />
        </nav>
        <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
          Manage
        </p>
        <NavItem href="/#settings" label="Settings" icon="settings" />
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#e7c47d]" />
            <span className="text-xs font-medium text-[#e1e9e2]">Payment follow-up</span>
          </div>
          <p className="mb-2 text-[11px] leading-relaxed text-[#9ca99e]">
            {pendingPayments} registrations need payment confirmation.
          </p>
          <a href="#payment-status" className="text-[10px] font-medium text-[#d3e4c9]">
            Review pending <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-1 pt-5">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#e9c6a6] text-xs font-semibold text-[#573c29]">
            TD
          </div>
          <div>
            <p className="text-xs font-medium">Tanmay Deshmukh</p>
            <p className="mt-0.5 text-[10px] text-[#9ca99e]">Administrator</p>
          </div>
        </div>
      </aside>

      <section className="lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e9ece6] bg-[#fbfcfa]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#e7efdf] text-[#3d5941] lg:hidden">
              <Icon name="camera" />
            </div>
            <div>
              <p className="text-[11px] text-[#8b948c]">
                Association / <span className="text-[#455248]">Registrations</span>
              </p>
              <p className="mt-0.5 text-sm font-semibold lg:hidden">Pune Camera Association</p>
            </div>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[11px] font-medium">Sunday, October 19</p>
            <p className="mt-0.5 text-[10px] text-[#8b948c]">2026</p>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[#7d8f78]">
                Workshops · Attendees · Payments
              </p>
              <h1 className="text-[28px] font-semibold tracking-[-.04em] text-[#1d2a21] sm:text-[32px]">
                Registrations
              </h1>
              <p className="mt-1.5 text-[13px] text-[#7b857d]">
                Track workshop sign-ups, payments and attendance.
              </p>
            </div>
            <Button className="h-10 w-fit gap-2 rounded-lg border border-[#e0e6de] bg-white px-3.5 text-xs font-medium text-[#536256] shadow-sm hover:bg-[#f7f9f5]">
              <Icon name="download" size={15} /> Export list
            </Button>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            <Summary
              title="Total registrations"
              value="108"
              note="Across all workshops"
              icon="ticket"
              tone="green"
            />
            <Summary
              title="Paid registrations"
              value="84"
              note="Payments confirmed"
              icon="check"
              tone="blue"
            />
            <Summary
              title="Pending payments"
              value={String(pendingPayments)}
              note="Needs follow-up"
              icon="wallet"
              tone="yellow"
            />
            <Summary
              title="Income collected"
              value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
              note="From workshop fees"
              icon="trend"
              tone="peach"
            />
          </div>

          <Card
            id="payment-status"
            className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
          >
            <CardContent className="p-0">
              <div className="flex flex-col justify-between gap-3 border-b border-[#edf0eb] px-4 pt-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex gap-5 overflow-x-auto">
                  {["All registrations", "Needs attention", "Attended"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setTab(item)}
                      className={`relative whitespace-nowrap pb-3 text-[11px] font-medium transition ${tab === item ? "text-[#38553b]" : "text-[#8c968e] hover:text-[#465449]"}`}
                    >
                      {item}
                      {item === "Needs attention" && (
                        <span className="ml-1.5 rounded-full bg-[#f5eee0] px-1.5 py-0.5 text-[9px] text-[#987340]">
                          {pendingPayments}
                        </span>
                      )}
                      {tab === item && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#55754c]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="pb-3 text-[10px] text-[#9aa39b]">{filtered.length} registrations</p>
              </div>
              <div className="flex flex-col gap-2.5 border-b border-[#edf0eb] p-4 sm:flex-row sm:items-center sm:px-5">
                <label className="relative flex-1">
                  <span className="sr-only">Search registrations</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929c93]">
                    <Icon name="search" size={15} />
                  </span>
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-9 border-[#e7ebe5] bg-white pl-9 text-[11px] shadow-none placeholder:text-[#9da69e] focus-visible:ring-[#98b784]"
                    placeholder="Search member, workshop or registration ID..."
                  />
                </label>
                <div className="flex gap-2">
                  <label>
                    <span className="sr-only">Filter workshop</span>
                    <select
                      value={workshopFilter}
                      onChange={(event) => setWorkshopFilter(event.target.value)}
                      className="h-9 max-w-[190px] rounded-md border border-[#e7ebe5] bg-white px-3 text-[10px] text-[#667168] outline-none focus:ring-2 focus:ring-[#98b784]"
                    >
                      <option>All workshops</option>
                      {workshops.map((workshop) => (
                        <option key={workshop}>{workshop}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Filter payment status</span>
                    <select
                      value={paymentFilter}
                      onChange={(event) => setPaymentFilter(event.target.value)}
                      className="h-9 rounded-md border border-[#e7ebe5] bg-white px-3 text-[10px] text-[#667168] outline-none focus:ring-2 focus:ring-[#98b784]"
                    >
                      <option>All payments</option>
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Refunded</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead>
                    <tr className="bg-[#fafbf9] text-[9px] font-medium uppercase tracking-[.1em] text-[#9aa39b]">
                      <th className="px-5 py-3 font-medium">Member</th>
                      <th className="px-3 py-3 font-medium">Workshop</th>
                      <th className="px-3 py-3 font-medium">Registered</th>
                      <th className="px-3 py-3 font-medium">Fee</th>
                      <th className="px-3 py-3 font-medium">Payment</th>
                      <th className="px-3 py-3 font-medium">Attendance</th>
                      <th className="px-5 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((registration) => (
                      <tr
                        key={registration.id}
                        className="border-t border-[#f0f2ee] text-[10px] transition hover:bg-[#fbfcfa]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar label={registration.avatar} tone={registration.tone} />
                            <div>
                              <p className="whitespace-nowrap text-[11px] font-medium text-[#37443a]">
                                {registration.name}
                              </p>
                              <p className="mt-1 text-[9px] text-[#929c94]">
                                {registration.memberId} · {registration.id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="max-w-[220px] px-3 py-3.5">
                          <p className="line-clamp-2 text-[10px] font-medium leading-relaxed text-[#556158]">
                            {registration.workshop}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-[#737f75]">
                          {registration.date}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 font-medium text-[#455148]">
                          ₹ {registration.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="px-3 py-3.5">
                          <PaymentBadge status={registration.payment} />
                        </td>
                        <td className="px-3 py-3.5">
                          <AttendanceBadge status={registration.attendance} />
                        </td>
                        <td className="px-5 py-3.5">
                          {registration.payment === "Pending" ? (
                            <button
                              onClick={() => updatePayment(registration.id)}
                              className="whitespace-nowrap rounded-md border border-[#e3e9df] bg-white px-2.5 py-1.5 text-[9px] font-medium text-[#55734b] hover:bg-[#f1f6ed]"
                            >
                              Mark paid
                            </button>
                          ) : registration.attendance === "Registered" ? (
                            <button
                              onClick={() => markAttendance(registration.id)}
                              className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-[9px] font-medium text-[#607451] hover:bg-[#f1f5ee]"
                            >
                              Mark attended
                            </button>
                          ) : (
                            <span className="text-[9px] text-[#9aa39b]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#6d8562]">
                      <Icon name="search" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-[#405044]">
                      No registrations found
                    </p>
                    <p className="mt-1 text-xs text-[#8c968e]">
                      Try changing your search or filters.
                    </p>
                    <button
                      onClick={() => {
                        setQuery("");
                        setWorkshopFilter("All workshops");
                        setPaymentFilter("All payments");
                        setTab("All registrations");
                      }}
                      className="mt-3 text-xs font-medium text-[#57754e]"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-between gap-3 border-t border-[#edf0eb] px-5 py-3.5 sm:flex-row">
                <p className="text-[10px] text-[#929c94]">
                  Showing{" "}
                  <span className="font-medium text-[#59645c]">
                    {filtered.length ? 1 : 0}–{filtered.length}
                  </span>{" "}
                  of <span className="font-medium text-[#59645c]">{filtered.length}</span> results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled
                    className="h-7 rounded-md border border-[#e8ece6] px-2.5 text-[10px] text-[#a3aca4]"
                  >
                    Previous
                  </button>
                  <button className="size-7 rounded-md bg-[#314c35] text-[10px] font-medium text-white">
                    1
                  </button>
                  <button className="size-7 rounded-md text-[10px] text-[#758077] hover:bg-[#f1f4ef]">
                    2
                  </button>
                  <button className="size-7 rounded-md text-[10px] text-[#758077] hover:bg-[#f1f4ef]">
                    3
                  </button>
                  <span className="px-1 text-[10px] text-[#9aa39b]">…</span>
                  <button className="size-7 rounded-md text-[10px] text-[#758077] hover:bg-[#f1f4ef]">
                    11
                  </button>
                  <button className="h-7 rounded-md border border-[#e8ece6] px-2.5 text-[10px] text-[#59645c] hover:bg-[#f6f8f4]">
                    Next
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
          <footer className="mt-7 flex flex-col justify-between gap-1 border-t border-[#e8ece6] pt-4 text-[9px] text-[#9ba49c] sm:flex-row">
            <span>© 2026 Pune Camera Photography Association</span>
            <span>
              Made for the love of photography <span className="text-[#bc806c]">♥</span>
            </span>
          </footer>
        </div>
      </section>
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border border-[#dce8d5] bg-white px-4 py-3 text-xs font-medium text-[#486044] shadow-lg"
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-[#eaf3e4]">
            <Icon name="check" size={13} />
          </span>
          {notice}
        </div>
      )}
    </main>
  );
}

function NavItem({
  href,
  label,
  icon,
  count,
  active = false,
}: {
  href: string;
  label: string;
  icon: string;
  count?: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition ${active ? "bg-[#2c3a30] font-medium text-[#e3f2d9]" : "text-[#bdc8bf] hover:bg-[#253229] hover:text-white"}`}
    >
      <Icon name={icon} />
      <span className="flex-1">{label}</span>
      {count && (
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-[#d2dcd4]">
          {count}
        </span>
      )}
    </a>
  );
}

function Summary({
  title,
  value,
  note,
  icon,
  tone,
}: {
  title: string;
  value: string;
  note: string;
  icon: string;
  tone: string;
}) {
  const tones: Record<string, string> = {
    green: "bg-[#edf4e8] text-[#69875d]",
    blue: "bg-[#edf1f6] text-[#6c8098]",
    yellow: "bg-[#f7f1df] text-[#aa8c48]",
    peach: "bg-[#fbf0e7] text-[#b9835c]",
  };
  return (
    <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
      <CardContent className="p-4 sm:p-[18px]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#818b82]">{title}</p>
          <span className={`flex size-8 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon name={icon} size={16} />
          </span>
        </div>
        <p className="mt-2 text-[25px] font-semibold tracking-[-.045em] text-[#26342a]">{value}</p>
        <p className="mt-1 text-[9px] text-[#929b93]">{note}</p>
      </CardContent>
    </Card>
  );
}

function Avatar({ label, tone }: { label: string; tone: string }) {
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
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${tones[tone] ?? tones.sage}`}
    >
      {label}
    </span>
  );
}

function PaymentBadge({ status }: { status: Registration["payment"] }) {
  const styles: Record<Registration["payment"], string> = {
    Paid: "bg-[#eaf3e4] text-[#557249]",
    Pending: "bg-[#fbf0dd] text-[#9a7134]",
    Refunded: "bg-[#f0f2ef] text-[#7b857d]",
  };
  const dots: Record<Registration["payment"], string> = {
    Paid: "bg-[#7c9c6c]",
    Pending: "bg-[#c99b50]",
    Refunded: "bg-[#9ba39c]",
  };
  return (
    <Badge
      className={`border-0 px-2 py-1 text-[9px] font-medium hover:opacity-90 ${styles[status]}`}
    >
      <span className={`mr-1.5 size-1.5 rounded-full ${dots[status]}`} />
      {status}
    </Badge>
  );
}

function AttendanceBadge({ status }: { status: Registration["attendance"] }) {
  const styles: Record<Registration["attendance"], string> = {
    Registered: "border-[#e3e9df] text-[#68766b]",
    Attended: "border-[#dce8d5] bg-[#f4f8f1] text-[#557249]",
    Waitlist: "border-[#eee5d2] bg-[#fbf7ec] text-[#957943]",
  };
  return (
    <Badge
      variant="outline"
      className={`rounded-md px-2 py-1 text-[9px] font-normal ${styles[status]}`}
    >
      {status}
    </Badge>
  );
}
