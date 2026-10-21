"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MobileSidebar from "@/app/components/mobile-sidebar";
import AppSidebar from "@/app/components/app-sidebar";

type Registration = {
  id: string;
  number: string;
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

type RegistrationRecord = {
  id: string;
  registrationNumber: string;
  memberNumber: string;
  memberName: string;
  memberEmail: string;
  workshopTitle: string;
  registeredAt: string;
  amount: number;
  paymentStatus: Registration["payment"];
  attendanceStatus: Registration["attendance"];
};
type MemberOption = { id: string; memberNumber: string; name: string };
type WorkshopOption = { id: string; title: string };

function registrationFromRecord(record: RegistrationRecord, index: number): Registration {
  const initials = record.memberName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const tones = ["sage", "peach", "blue", "lavender", "rose", "yellow"];

  return {
    id: record.id,
    number: record.registrationNumber,
    name: record.memberName,
    email: record.memberEmail,
    memberId: record.memberNumber,
    workshop: record.workshopTitle,
    date: new Date(record.registeredAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    amount: record.amount,
    payment: record.paymentStatus,
    attendance: record.attendanceStatus,
    avatar: initials,
    tone: tones[index % tones.length],
  };
}

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
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [workshopOptions, setWorkshopOptions] = useState<WorkshopOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState("");
  const [query, setQuery] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("All workshops");
  const [paymentFilter, setPaymentFilter] = useState("All payments");
  const [tab, setTab] = useState("All registrations");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isActive = true;
    Promise.all(["/api/registrations", "/api/members", "/api/workshops"].map((url) => fetch(url)))
      .then(async ([registrationsResponse, membersResponse, workshopsResponse]) => {
        const [registrationData, memberData, workshopData] = await Promise.all([
          registrationsResponse.json(),
          membersResponse.json(),
          workshopsResponse.json(),
        ]);
        const responses = [registrationsResponse, membersResponse, workshopsResponse];
        const results = [registrationData, memberData, workshopData];
        const failedIndex = responses.findIndex((response) => !response.ok);
        if (failedIndex !== -1) {
          throw new Error(results[failedIndex].error || "Could not load registration data.");
        }
        if (isActive) {
          setRegistrations(
            registrationData.map((record: RegistrationRecord, index: number) =>
              registrationFromRecord(record, index),
            ),
          );
          setMembers(memberData);
          setWorkshopOptions(workshopData);
        }
      })
      .catch((error: unknown) => {
        if (isActive)
          setLoadError(
            error instanceof Error ? error.message : "Could not load registration data.",
          );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const workshops = Array.from(
    new Set([
      ...workshopOptions.map((workshop) => workshop.title),
      ...registrations.map((registration) => registration.workshop),
    ]),
  );
  const filtered = useMemo(
    () =>
      registrations.filter((registration) => {
        const needle = query.trim().toLowerCase();
        const matchesSearch =
          !needle ||
          [
            registration.name,
            registration.email,
            registration.number,
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

  async function updateRegistration(id: string, data: object, successMessage: string) {
    const response = await fetch(`/api/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      setNotice(result.error || "Could not update registration.");
      return;
    }
    setRegistrations((current) =>
      current.map((registration) =>
        registration.id === id
          ? {
              ...registration,
              payment: result.paymentStatus,
              attendance: result.attendanceStatus,
            }
          : registration,
      ),
    );
    setNotice(successMessage);
    window.setTimeout(() => setNotice(""), 2600);
  }

  async function createRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: selectedMember, workshopId: selectedWorkshop }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save registration.");
      setRegistrations((current) => [registrationFromRecord(result, 0), ...current]);
      setSelectedMember("");
      setSelectedWorkshop("");
      setShowCreateForm(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const pendingPayments = registrations.filter(
    (registration) => registration.payment === "Pending",
  ).length;
  const paidRegistrations = registrations.filter(
    (registration) => registration.payment === "Paid",
  ).length;
  const totalRevenue = registrations
    .filter((registration) => registration.payment === "Paid")
    .reduce((sum, registration) => sum + registration.amount, 0);

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2720]">
      <AppSidebar activeRoute="registrations" counts={{ registrations: registrations.length }} />

      <section className="lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e9ece6] bg-[#fbfcfa]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center">
            <MobileSidebar navItems={[{ label: "Overview", href: "/", icon: "◫" }, { label: "Members", href: "/members", icon: "♧" }, { label: "Workshops", href: "/workshops", icon: "▦" }, { label: "Registrations", href: "/registrations", icon: "▤", active: true, count: registrations.length }]} summary={`${registrations.length} registrations`} />
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
            <Button
              onClick={() => setShowCreateForm(true)}
              className="h-10 w-fit gap-2 rounded-lg bg-[#314c35] px-3.5 text-xs font-medium text-white shadow-sm hover:bg-[#263d2a]"
            >
              <Icon name="plus" size={15} /> Create registration
            </Button>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            <Summary
              title="Total registrations"
              value={String(registrations.length)}
              note="Across all workshops"
              icon="ticket"
              tone="green"
            />
            <Summary
              title="Paid registrations"
              value={String(paidRegistrations)}
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
                                {registration.memberId} · {registration.number}
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
                              onClick={() =>
                                void updateRegistration(
                                  registration.id,
                                  { paymentStatus: "Paid" },
                                  "Payment marked as received",
                                )
                              }
                              className="whitespace-nowrap rounded-md border border-[#e3e9df] bg-white px-2.5 py-1.5 text-[9px] font-medium text-[#55734b] hover:bg-[#f1f6ed]"
                            >
                              Mark paid
                            </button>
                          ) : registration.attendance === "Registered" ? (
                            <button
                              onClick={() =>
                                void updateRegistration(
                                  registration.id,
                                  { attendanceStatus: "Attended" },
                                  "Attendance marked",
                                )
                              }
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
                {isLoading && (
                  <p className="px-5 py-14 text-center text-xs text-[#8c968e]">
                    Loading registrations from the database…
                  </p>
                )}
                {!isLoading && loadError && (
                  <p role="alert" className="px-5 py-14 text-center text-xs text-red-600">
                    {loadError}
                  </p>
                )}
                {!isLoading && !loadError && filtered.length === 0 && (
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
                <span className="text-[10px] text-[#929c94]">Registrations from database</span>
              </div>
            </CardContent>
          </Card>
          <footer className="mt-7 flex flex-col justify-between gap-1 border-t border-[#e8ece6] pt-4 text-[9px] text-[#9ba49c] sm:flex-row">
            <span>Pune Camera Photography Association</span>
            <span>
              Made for the love of photography <span className="text-[#bc806c]">♥</span>
            </span>
          </footer>
        </div>
      </section>
      {showCreateForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#142019]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCreateForm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-registration-title"
            className="w-full max-w-[460px] rounded-2xl border border-[#e7ebe5] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#78906f]">
                  Workshop attendance
                </p>
                <h2 id="create-registration-title" className="mt-1 text-lg font-semibold">
                  Create registration
                </h2>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-lg leading-none text-[#859087] hover:bg-[#f2f4f0]"
              >
                ×
              </button>
            </div>
            <form onSubmit={createRegistration} className="mt-5 space-y-4">
              <label className="block text-[11px] font-medium text-[#556158]">
                Member
                <select
                  required
                  value={selectedMember}
                  onChange={(event) => setSelectedMember(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#e7ebe5] bg-white px-3 text-xs"
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} · {member.memberNumber}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-[11px] font-medium text-[#556158]">
                Workshop
                <select
                  required
                  value={selectedWorkshop}
                  onChange={(event) => setSelectedWorkshop(event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#e7ebe5] bg-white px-3 text-xs"
                >
                  <option value="">Select a workshop</option>
                  {workshopOptions.map((workshop) => (
                    <option key={workshop.id} value={workshop.id}>
                      {workshop.title}
                    </option>
                  ))}
                </select>
              </label>
              {(!members.length || !workshopOptions.length) && (
                <p className="text-xs text-[#8c968e]">
                  Add at least one member and one workshop before creating a registration.
                </p>
              )}
              {submitError && (
                <p role="alert" className="text-xs text-red-600">
                  {submitError}
                </p>
              )}
              <div className="flex justify-end gap-2 border-t border-[#edf0eb] pt-4">
                <Button
                  onClick={() => setShowCreateForm(false)}
                  className="h-9 rounded-lg border border-[#e4e9e2] bg-white px-3 text-xs text-[#5f6b62]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !members.length || !workshopOptions.length}
                  className="h-9 rounded-lg bg-[#314c35] px-3.5 text-xs text-white"
                >
                  {isSubmitting ? "Saving…" : "Create registration"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
