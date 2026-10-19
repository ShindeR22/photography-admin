"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { workshopSchema } from "@/lib/zod/workshop";

type WorkshopStatus = "Registration open" | "Almost full" | "Planning" | "Completed";
type Workshop = {
  id: string;
  title: string;
  date: string;
  dateIso: string;
  dateShort: string;
  time: string;
  venue: string;
  fee: number;
  status: WorkshopStatus;
  tone: string;
  description: string;
  mentorName: string;
};
type WorkshopRecord = {
  id: string;
  title: string;
  date: string;
  venue: string;
  registrationFee: number;
  description: string;
  mentorName: string;
  time: string;
  status: string;
};

function workshopFromRecord(record: WorkshopRecord, index: number): Workshop {
  const date = new Date(record.date);
  const status = ["Registration open", "Almost full", "Planning", "Completed"].includes(
    record.status,
  )
    ? (record.status as WorkshopStatus)
    : "Planning";

  return {
    id: record.id,
    title: record.title,
    date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }),
    dateIso: record.date,
    dateShort: `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleDateString("en", { month: "short" }).toUpperCase()}`,
    time: record.time,
    venue: record.venue,
    fee: record.registrationFee,
    status,
    tone: ["olive", "rose", "blue", "peach", "yellow"][index % 5],
    description: record.description,
    mentorName: record.mentorName,
  };
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const shapes: Record<string, ReactNode> = {
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
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: (
      <>
        <path d="M5 12h14m-6-6 6 6-6 6" />
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
      {shapes[name] ?? shapes.calendar}
    </svg>
  );
}

export default function WorkshopsDirectory() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All workshops");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [fee, setFee] = useState("1200");
  const [description, setDescription] = useState("");
  const [mentorName, setMentorName] = useState("");
  const [time, setTime] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;
    fetch("/api/workshops")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load workshops.");
        if (isActive) {
          setCurrentTime(Date.now());
          setWorkshops(
            result.map((record: WorkshopRecord, index: number) =>
              workshopFromRecord(record, index),
            ),
          );
        }
      })
      .catch((error: unknown) => {
        if (isActive)
          setLoadError(error instanceof Error ? error.message : "Could not load workshops.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const nextWorkshop = useMemo(
    () =>
      workshops
        .filter((workshop) => new Date(workshop.dateIso).getTime() >= currentTime)
        .sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime())[0],
    [workshops, currentTime],
  );
  const thisYearCount = workshops.filter(
    (workshop) => new Date(workshop.dateIso).getFullYear() === new Date(currentTime).getFullYear(),
  ).length;
  const upcomingCount = workshops.filter(
    (workshop) => new Date(workshop.dateIso).getTime() >= currentTime,
  ).length;
  const totalFees = workshops.reduce((total, workshop) => total + workshop.fee, 0);

  const visible = useMemo(
    () =>
      workshops.filter((workshop) => {
        const matchesQuery =
          !query.trim() ||
          [workshop.title, workshop.mentorName, workshop.venue].some((value) =>
            value.toLowerCase().includes(query.trim().toLowerCase()),
          );
        const isUpcoming = new Date(workshop.dateIso).getTime() >= currentTime;
        const matchesTab =
          activeTab === "All workshops" ||
          (activeTab === "Upcoming" && isUpcoming) ||
          (activeTab === "Completed" && !isUpcoming);
        return matchesQuery && matchesTab;
      }),
    [workshops, query, activeTab, currentTime],
  );

  async function createWorkshop(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setSubmitError("");
    const validation = workshopSchema.safeParse({
      title,
      date,
      venue,
      registrationFee: fee,
      description,
      mentorName,
      time,
    });
    if (!validation.success) {
      setSubmitError(
        validation.error.issues[0]?.message ?? "Check the workshop details and try again.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/workshops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save the workshop.");

      setWorkshops((current) => [workshopFromRecord(result as WorkshopRecord, 0), ...current]);
      setActiveTab("All workshops");
      setQuery("");
      setTitle("");
      setDate("");
      setVenue("");
      setFee("1200");
      setDescription("");
      setMentorName("");
      setTime("");
      setShowForm(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save the workshop.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <NavItem href="/members" label="Members" icon="users" />
          <NavItem
            href="/workshops"
            label="Workshops"
            icon="calendar"
            count={String(workshops.length)}
            active
          />
          <NavItem href="/registrations" label="Registrations" icon="ticket" count="12" />
          <NavItem href="/#accounts" label="Accounts" icon="wallet" />
        </nav>
        <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
          Manage
        </p>
        <NavItem href="/#settings" label="Settings" icon="settings" />
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#aad58c]" />
            <span className="text-xs font-medium text-[#e1e9e2]">Next workshop</span>
          </div>
          {nextWorkshop ? (
            <>
              <p className="mb-1 text-[11px] font-medium leading-relaxed text-[#e1e9e2]">
                {nextWorkshop.title}
              </p>
              <p className="text-[10px] text-[#aab7ac]">
                {nextWorkshop.date} · {nextWorkshop.venue}
              </p>
            </>
          ) : (
            <p className="text-[11px] text-[#9ca99e]">No upcoming workshops</p>
          )}
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
                Association / <span className="text-[#455248]">Workshops</span>
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
                Learn · Practise · Create
              </p>
              <h1 className="text-[28px] font-semibold tracking-[-.04em] text-[#1d2a21] sm:text-[32px]">
                Workshops
              </h1>
              <p className="mt-1.5 text-[13px] text-[#7b857d]">
                Plan monthly sessions and keep track of member registrations.
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="h-10 w-fit gap-2 rounded-lg bg-[#314c35] px-4 text-xs font-medium text-white shadow-sm hover:bg-[#263d2a]"
            >
              <Icon name="plus" size={16} /> Create workshop
            </Button>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            <Summary
              title="Workshops this year"
              value={String(thisYearCount)}
              note="From the workshops collection"
              icon="calendar"
              tone="green"
            />
            <Summary
              title="Upcoming workshops"
              value={String(upcomingCount)}
              note="Based on workshop dates"
              icon="clock"
              tone="yellow"
            />
            <Summary
              title="Mentors"
              value={String(new Set(workshops.map((workshop) => workshop.mentorName)).size)}
              note="Saved workshop mentors"
              icon="users"
              tone="blue"
            />
            <Summary
              title="Listed registration fees"
              value={`₹ ${totalFees.toLocaleString("en-IN")}`}
              note="Combined fees for saved workshops"
              icon="wallet"
              tone="peach"
            />
          </div>

          <Card className="mb-5 overflow-hidden rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
            <CardContent className="grid p-0 lg:grid-cols-[1.25fr_.75fr]">
              <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#24362b] p-6 text-white sm:p-7">
                <div className="absolute -right-12 -top-16 size-64 rounded-full border border-white/10" />
                <div className="relative">
                  <Badge className="border-0 bg-[#d9edc9]/15 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[.1em] text-[#daedcc]">
                    {nextWorkshop ? "Next workshop" : "Workshops"}
                  </Badge>
                  {nextWorkshop ? (
                    <>
                      <h2 className="mt-6 max-w-[480px] text-[24px] font-semibold leading-tight tracking-[-.035em] sm:text-[28px]">
                        {nextWorkshop.title}
                      </h2>
                      <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#c0ccc1]">
                        {nextWorkshop.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#c0ccc1]">
                        <span className="flex items-center gap-1.5">
                          <Icon name="calendar" size={13} />
                          {nextWorkshop.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Icon name="pin" size={13} />
                          {nextWorkshop.venue}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="mt-6 text-sm text-[#c0ccc1]">
                      No upcoming workshops in the database.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-7">
                {nextWorkshop ? (
                  <>
                    <p className="text-[10px] text-[#89938a]">Workshop time</p>
                    <p className="mt-1 text-sm font-semibold">{nextWorkshop.time}</p>
                    <div className="mt-5 border-t border-[#edf0eb] pt-4">
                      <p className="text-[10px] text-[#89938a]">Registration fee</p>
                      <p className="mt-1 text-sm font-semibold">
                        ₹ {nextWorkshop.fee.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="mt-4">
                      <p className="text-[10px] text-[#89938a]">Mentor</p>
                      <p className="mt-1 text-sm font-semibold">{nextWorkshop.mentorName}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[#89938a]">Create a workshop to see it here.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card
            id="workshop-list"
            className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
          >
            <CardContent className="p-0">
              <div className="flex flex-col justify-between gap-3 border-b border-[#edf0eb] px-4 pt-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex gap-5 overflow-x-auto">
                  {["All workshops", "Upcoming", "Completed"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative whitespace-nowrap pb-3 text-[11px] font-medium transition ${activeTab === tab ? "text-[#38553b]" : "text-[#8c968e] hover:text-[#465449]"}`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#55754c]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="pb-3 text-[10px] text-[#9aa39b]">{visible.length} workshops</p>
              </div>
              <div className="flex flex-col gap-2.5 border-b border-[#edf0eb] p-4 sm:flex-row sm:items-center sm:px-5">
                <label className="relative flex-1">
                  <span className="sr-only">Search workshops</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929c93]">
                    <Icon name="search" size={15} />
                  </span>
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-9 border-[#e7ebe5] bg-white pl-9 text-[11px] shadow-none placeholder:text-[#9da69e] focus-visible:ring-[#98b784]"
                    placeholder="Search workshops or venues..."
                  />
                </label>
              </div>
              <div className="divide-y divide-[#f0f2ee]">
                {visible.map((workshop) => (
                  <article
                    key={workshop.id}
                    className="flex flex-col gap-4 px-4 py-4 transition hover:bg-[#fbfcfa] sm:flex-row sm:items-center sm:px-5"
                  >
                    <div
                      className={`flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-xl ${workshop.tone === "olive" ? "bg-[#edf3e9] text-[#607952]" : workshop.tone === "rose" ? "bg-[#f7e9e7] text-[#a7685d]" : workshop.tone === "blue" ? "bg-[#e9eff4] text-[#657f94]" : workshop.tone === "peach" ? "bg-[#f7ede3] text-[#a77b55]" : "bg-[#f5f0df] text-[#927c3d]"}`}
                    >
                      <span className="text-[9px] font-semibold tracking-[.08em]">
                        {workshop.dateShort.split(" ")[1]}
                      </span>
                      <span className="mt-0.5 text-[19px] font-semibold leading-none">
                        {workshop.dateShort.split(" ")[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[12px] font-semibold text-[#344037]">
                          {workshop.title}
                        </h3>
                        <WorkshopBadge status={workshop.status} />
                      </div>
                      <p className="mt-1 text-[10px] text-[#89938b]">{workshop.id}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] text-[#68746a]">
                        {workshop.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-[#879188]">
                        <span className="flex items-center gap-1">
                          <Icon name="clock" size={12} />
                          {workshop.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="pin" size={12} />
                          {workshop.venue}
                        </span>
                        <span>Mentor: {workshop.mentorName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-[#8c968e]">Registration fee</p>
                      <p className="mt-1 text-sm font-semibold text-[#455148]">
                        ₹ {workshop.fee.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              {isLoading && (
                <div className="px-5 py-14 text-center text-xs text-[#8c968e]">
                  Loading workshops from the database…
                </div>
              )}
              {!isLoading && loadError && (
                <div role="alert" className="px-5 py-14 text-center text-xs text-red-600">
                  {loadError}
                </div>
              )}
              {!isLoading && !loadError && visible.length === 0 && (
                <div className="px-5 py-14 text-center">
                  <p className="text-sm font-medium text-[#405044]">
                    No workshops found in the database
                  </p>
                  <p className="mt-1 text-xs text-[#8c968e]">
                    Create a workshop to add the first entry.
                  </p>
                </div>
              )}
              <div className="border-t border-[#edf0eb] px-5 py-3.5">
                <p className="text-[10px] text-[#929c94]">
                  Showing {visible.length} database{" "}
                  {visible.length === 1 ? "workshop" : "workshops"}
                </p>
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

      {showForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#142019]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="workshop-form-title"
            className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-2xl border border-[#e7ebe5] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#78906f]">
                  Workshop calendar
                </p>
                <h2 id="workshop-form-title" className="mt-1 text-lg font-semibold tracking-tight">
                  Create a workshop
                </h2>
                <p className="mt-1 text-xs text-[#858f87]">
                  Add a session to the association calendar.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-lg leading-none text-[#859087] hover:bg-[#f2f4f0]"
              >
                ×
              </button>
            </div>
            <form onSubmit={createWorkshop} className="mt-5 space-y-4">
              <label className="block text-[11px] font-medium text-[#556158]">
                Workshop title
                <Input
                  required
                  maxLength={120}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1.5 h-10 text-xs"
                  placeholder="e.g. Photographing the night sky"
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-[11px] font-medium text-[#556158]">
                  Date
                  <Input
                    required
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="mt-1.5 h-10 text-xs"
                  />
                </label>
                <label className="block text-[11px] font-medium text-[#556158]">
                  Venue
                  <Input
                    required
                    maxLength={180}
                    value={venue}
                    onChange={(event) => setVenue(event.target.value)}
                    className="mt-1.5 h-10 text-xs"
                    placeholder="Location or meeting point"
                  />
                </label>
              </div>
              <label className="block text-[11px] font-medium text-[#556158]">
                Registration fee (₹)
                <Input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={fee}
                  onChange={(event) => setFee(event.target.value)}
                  className="mt-1.5 h-10 text-xs"
                />
              </label>
              <label className="block text-[11px] font-medium text-[#556158]">
                Description
                <textarea
                  required
                  maxLength={2000}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-1.5 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="What will participants learn?"
                />
              </label>
              <label className="block text-[11px] font-medium text-[#556158]">
                Mentor name
                <Input
                  required
                  maxLength={120}
                  value={mentorName}
                  onChange={(event) => setMentorName(event.target.value)}
                  className="mt-1.5 h-10 text-xs"
                  placeholder="Workshop mentor"
                />
              </label>
              <label className="block text-[11px] font-medium text-[#556158]">
                Workshop time
                <Input
                  required
                  maxLength={80}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-1.5 h-10 text-xs"
                  placeholder="e.g. 10:00 AM – 1:00 PM"
                />
              </label>
              {submitError && (
                <p role="alert" className="text-xs text-red-600">
                  {submitError}
                </p>
              )}
              <div className="flex items-center justify-between border-t border-[#edf0eb] pt-4">
                <p className="text-[10px] text-[#909990]">New workshops start in planning.</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setShowForm(false)}
                    className="h-9 rounded-lg border border-[#e4e9e2] bg-white px-3 text-xs text-[#5f6b62] hover:bg-[#f7f9f5]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 rounded-lg bg-[#314c35] px-3.5 text-xs text-white hover:bg-[#263d2a]"
                  >
                    {isSubmitting ? "Saving…" : "Create workshop"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
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

function WorkshopBadge({ status }: { status: WorkshopStatus }) {
  const styles: Record<WorkshopStatus, string> = {
    "Registration open": "bg-[#eaf3e4] text-[#557249]",
    "Almost full": "bg-[#fbf0dd] text-[#9a7134]",
    Planning: "bg-[#edf1f6] text-[#657b91]",
    Completed: "bg-[#f0f2ef] text-[#7b857d]",
  };
  return (
    <Badge
      className={`border-0 px-2 py-1 text-[8px] font-medium hover:opacity-90 ${styles[status]}`}
    >
      <span className="mr-1.5 size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </Badge>
  );
}
