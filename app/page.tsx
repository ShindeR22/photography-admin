import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const members = [
  {
    name: "Aarav Deshmukh",
    initials: "AD",
    type: "Lifetime",
    date: "18 Oct, 2026",
    status: "Active",
    color: "sage",
  },
  {
    name: "Mira Kulkarni",
    initials: "MK",
    type: "Annual",
    date: "17 Oct, 2026",
    status: "Active",
    color: "peach",
  },
  {
    name: "Rohan Patil",
    initials: "RP",
    type: "Annual",
    date: "16 Oct, 2026",
    status: "Pending",
    color: "blue",
  },
  {
    name: "Ananya Shah",
    initials: "AS",
    type: "Student",
    date: "15 Oct, 2026",
    status: "Active",
    color: "lavender",
  },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
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
        <path d="M3 9h18M16 14h2M6 5V4a2 2 0 0 1 2-2h10" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.8-.7-.2.1-1.4.8-.3 1.9h-3l-.3-1.9-1.6-.9-1.8.7-1.5-2.6 1.5-1.2v-1.8l-1.5-1.2L7 9.4l1.8.7 1.6-.9.3-1.9h3l.3 1.9 1.6.9 1.8-.7 1.5 2.6-1.5 1.2z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </>
    ),
    camera: (
      <>
        <path d="M14 4H9L7 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
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
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return <svg {...common}>{paths[name] ?? paths.grid}</svg>;
}

const navigation = [
  { label: "Overview", icon: "grid", href: "/", active: true },
  { label: "Members", icon: "users", href: "/members", count: "248" },
  { label: "Workshops", icon: "calendar", href: "/workshops" },
  { label: "Registrations", icon: "ticket", href: "/registrations", count: "12" },
  { label: "Accounts", icon: "wallet", href: "/#accounts" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2720]">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-[252px] flex-col bg-[#19241d] px-5 py-6 text-white lg:flex">
        <a href="#overview" className="mb-10 flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#d5edbd] text-[#243a27]">
            <Icon name="camera" size={21} />
          </span>
          <span>
            <span className="block text-[15px] font-semibold tracking-tight">Pune Camera</span>
            <span className="mt-0.5 block text-[11px] tracking-[.12em] text-[#a5b3a7]">
              PHOTOGRAPHY ASSOCIATION
            </span>
          </span>
        </a>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
          Workspace
        </p>
        <nav className="space-y-1" aria-label="Main navigation">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`nav-link flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] transition ${item.active ? "bg-[#2c3a30] font-medium text-[#e3f2d9]" : "text-[#bdc8bf] hover:bg-[#253229] hover:text-white"}`}
            >
              <Icon name={item.icon} />
              <span className="flex-1">{item.label}</span>
              {item.count && (
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-[#d2dcd4]">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>
        <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-[#87968a]">
          Manage
        </p>
        <a
          href="#settings"
          className="nav-link flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] text-[#bdc8bf] transition hover:bg-[#253229] hover:text-white"
        >
          <Icon name="settings" />
          <span>Settings</span>
        </a>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#aad58c]" />
            <span className="text-xs font-medium text-[#e1e9e2]">Membership drive</span>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-[#9ca99e]">
            Annual membership renewals are open for 2026–27.
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[68%] rounded-full bg-[#b9dfa0]" />
          </div>
          <p className="mt-2 text-[10px] text-[#aab7ac]">68% renewed</p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/10 px-1 pt-5">
          <div className="flex size-9 items-center justify-center rounded-full bg-[#e9c6a6] text-xs font-semibold text-[#573c29]">
            TD
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">Tanmay Deshmukh</p>
            <p className="mt-0.5 text-[10px] text-[#9ca99e]">Administrator</p>
          </div>
          <Icon name="more" size={17} />
        </div>
      </aside>

      <section id="overview" className="lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e9ece6] bg-[#fbfcfa]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#e7efdf] text-[#3d5941] lg:hidden">
              <Icon name="camera" />
            </div>
            <div>
              <p className="text-[11px] text-[#8b948c]">
                Association / <span className="text-[#455248]">Overview</span>
              </p>
              <p className="mt-0.5 text-sm font-semibold lg:hidden">Pune Camera Association</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <label className="relative hidden sm:block">
              <span className="sr-only">Search</span>
              <Icon name="search" size={16} />
              <Input
                className="h-9 w-[210px] border-[#e7ebe5] bg-white pl-9 text-xs shadow-none placeholder:text-[#9da69e] focus-visible:ring-[#98b784]"
                placeholder="Search anything..."
              />
            </label>
            <button
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-lg text-[#68736a] hover:bg-[#eef1eb]"
            >
              <Icon name="bell" />
              <span className="absolute right-[8px] top-[7px] size-1.5 rounded-full bg-[#da8069] ring-2 ring-[#fbfcfa]" />
            </button>
            <div className="hidden h-7 w-px bg-[#e7ebe5] sm:block" />
            <div className="hidden text-right sm:block">
              <p className="text-[11px] font-medium">Sunday, October 19</p>
              <p className="mt-0.5 text-[10px] text-[#8b948c]">2026</p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[#7d8f78]">
                Sunday, October 19, 2026
              </p>
              <h1 className="text-[26px] font-semibold tracking-[-.04em] text-[#1d2a21] sm:text-[30px]">
                Good morning, Tanmay{" "}
                <span className="inline-block origin-bottom animate-[wave_1.8s_ease-in-out_infinite]">
                  ✦
                </span>
              </h1>
              <p className="mt-1.5 text-[13px] text-[#7b857d]">
                Here&apos;s what&apos;s happening with your association today.
              </p>
            </div>
            <Button className="h-10 w-fit gap-2 rounded-lg bg-[#314c35] px-4 text-xs font-medium text-white shadow-sm hover:bg-[#263d2a]">
              <Icon name="plus" size={16} /> Add new member
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              title="Total members"
              value="248"
              change="12"
              caption="vs. last month"
              icon="users"
              accent="green"
            />
            <Metric
              title="Workshop registrations"
              value="36"
              change="8"
              caption="for this month"
              icon="calendar"
              accent="peach"
            />
            <Metric
              title="Revenue this month"
              value="₹ 42,800"
              change="14.5%"
              caption="vs. last month"
              icon="wallet"
              accent="blue"
            />
            <Metric
              title="Pending renewals"
              value="18"
              change="Needs attention"
              caption="membership renewals"
              icon="clock"
              accent="yellow"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
            <Card
              id="workshops"
              className="overflow-hidden rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <div>
                  <CardTitle className="text-[14px] font-semibold tracking-[-.02em]">
                    Upcoming workshop
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-[#8a948b]">Your next association event</p>
                </div>
                <button
                  aria-label="More workshop options"
                  className="flex size-8 items-center justify-center rounded-md text-[#828d84] hover:bg-[#f3f5f1]"
                >
                  <Icon name="more" size={18} />
                </button>
              </CardHeader>
              <CardContent className="grid gap-5 p-5 sm:grid-cols-[1.1fr_.9fr] sm:p-6">
                <div className="relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-xl bg-[#24362b] p-5 text-white">
                  <div className="absolute -right-8 -top-10 size-44 rounded-full border border-white/10" />
                  <div className="absolute -right-1 top-5 size-28 rounded-full border border-white/10" />
                  <div className="relative flex items-start justify-between">
                    <Badge className="border-0 bg-[#d9edc9]/15 px-2.5 py-1 text-[10px] font-medium text-[#daedcc] hover:bg-[#d9edc9]/15">
                      REGISTRATIONS OPEN
                    </Badge>
                    <Icon name="camera" size={22} />
                  </div>
                  <div className="relative">
                    <p className="mb-1.5 text-[10px] uppercase tracking-[.13em] text-[#bdcbbb]">
                      October masterclass
                    </p>
                    <h3 className="max-w-[290px] text-[21px] font-semibold leading-tight tracking-[-.035em]">
                      The art of street photography
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-[#c0ccc1]">
                      <span className="flex items-center gap-1.5">
                        <Icon name="calendar" size={13} /> 26 Oct, 2026
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Icon name="pin" size={13} /> Pune, Maharashtra
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <p className="text-[11px] font-medium text-[#818b82]">Workshop progress</p>
                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-[27px] font-semibold tracking-[-.04em]">
                        36<span className="ml-1 text-sm font-normal text-[#9aa39b]">/ 50</span>
                      </p>
                      <p className="mb-1 text-[10px] text-[#8b958c]">spots filled</p>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#edf1e9]">
                      <div className="h-full w-[72%] rounded-full bg-[#78956a]" />
                    </div>
                    <p className="mt-2 text-[10px] text-[#89938a]">
                      14 seats left · Registration closes Oct 24
                    </p>
                    <div className="mt-5 border-t border-[#edf0eb] pt-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-medium">Workshop fee</p>
                        <p className="text-sm font-semibold">
                          ₹ 1,200{" "}
                          <span className="text-[10px] font-normal text-[#8c968e]">/ person</span>
                        </p>
                      </div>
                      <div className="mt-3 flex -space-x-2">
                        <Avatar label="AD" color="sage" />
                        <Avatar label="MK" color="peach" />
                        <Avatar label="RP" color="blue" />
                        <Avatar label="AS" color="lavender" />
                        <span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#f0f2ee] text-[9px] font-medium text-[#727c74]">
                          +32
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href="/workshops"
                    className="mt-5 flex h-9 items-center justify-between rounded-lg border border-[#e5eae3] px-3 text-[11px] font-medium text-[#354b37] transition hover:bg-[#f8faf6]"
                  >
                    View workshop details <Icon name="arrow" size={15} />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card
              id="registrations"
              className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
            >
              <CardHeader className="flex flex-row items-center justify-between px-5 pb-1 pt-5 sm:px-6">
                <div>
                  <CardTitle className="text-[14px] font-semibold tracking-[-.02em]">
                    Recent activity
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-[#8a948b]">
                    Latest updates from your members
                  </p>
                </div>
                <button className="text-[10px] font-medium text-[#597451] hover:text-[#314c35]">
                  View all
                </button>
              </CardHeader>
              <CardContent className="px-5 pb-3 pt-3 sm:px-6">
                {[
                  {
                    initials: "MK",
                    color: "peach",
                    title: "Mira Kulkarni",
                    detail: "registered for October workshop",
                    time: "12 min ago",
                    tag: "Registration",
                  },
                  {
                    initials: "AD",
                    color: "sage",
                    title: "Aarav Deshmukh",
                    detail: "renewed lifetime membership",
                    time: "1 hour ago",
                    tag: "Membership",
                  },
                  {
                    initials: "NS",
                    color: "lavender",
                    title: "Neha Shah",
                    detail: "submitted a new membership application",
                    time: "3 hours ago",
                    tag: "New member",
                  },
                  {
                    initials: "RP",
                    color: "blue",
                    title: "Rohan Patil",
                    detail: "payment received · ₹1,200",
                    time: "Yesterday",
                    tag: "Payment",
                  },
                ].map((activity, i) => (
                  <div
                    key={activity.title}
                    className={`flex gap-3 py-3.5 ${i !== 0 ? "border-t border-[#f0f2ee]" : ""}`}
                  >
                    <Avatar label={activity.initials} color={activity.color} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-[#344037]">
                        {activity.title}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-[#89938b]">{activity.detail}</p>
                      <p className="mt-1.5 text-[9px] text-[#a2aaa3]">{activity.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-0.5 h-fit shrink-0 border-[#e8ece6] px-2 py-1 text-[9px] font-normal text-[#737e75]"
                    >
                      {activity.tag}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
            <Card
              id="members"
              className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <div>
                  <CardTitle className="text-[14px] font-semibold tracking-[-.02em]">
                    Recent members
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-[#8a948b]">
                    New members who joined the association
                  </p>
                </div>
                <a
                  href="/members"
                  className="flex items-center gap-1 text-[10px] font-medium text-[#597451]"
                >
                  All members <Icon name="chevron" size={13} />
                </a>
              </CardHeader>
              <CardContent className="overflow-x-auto px-0 pb-1">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="text-[9px] font-medium uppercase tracking-[.1em] text-[#9aa39b]">
                      <th className="px-5 py-3 font-medium sm:px-6">Member</th>
                      <th className="px-3 py-3 font-medium">Membership</th>
                      <th className="px-3 py-3 font-medium">Joined on</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium sm:px-6" />
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.name} className="border-t border-[#f0f2ee] text-[10px]">
                        <td className="px-5 py-3.5 sm:px-6">
                          <div className="flex items-center gap-2.5">
                            <Avatar label={member.initials} color={member.color} />
                            <span className="whitespace-nowrap font-medium text-[#37443a]">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[#737f75]">{member.type}</td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-[#737f75]">
                          {member.date}
                        </td>
                        <td className="px-3 py-3.5">
                          <Badge
                            className={`border-0 px-2 py-1 text-[9px] font-medium ${member.status === "Active" ? "bg-[#eaf3e4] text-[#557249] hover:bg-[#eaf3e4]" : "bg-[#fbf0dd] text-[#9a7134] hover:bg-[#fbf0dd]"}`}
                          >
                            <span
                              className={`mr-1.5 size-1.5 rounded-full ${member.status === "Active" ? "bg-[#7c9c6c]" : "bg-[#c99b50]"}`}
                            />
                            {member.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right sm:px-6">
                          <button
                            aria-label={`More options for ${member.name}`}
                            className="text-[#909a91]"
                          >
                            <Icon name="more" size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card
              id="accounts"
              className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]"
            >
              <CardHeader className="flex flex-row items-center justify-between border-b border-[#edf0eb] px-5 py-4 sm:px-6">
                <div>
                  <CardTitle className="text-[14px] font-semibold tracking-[-.02em]">
                    Monthly finances
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-[#8a948b]">October 2026 overview</p>
                </div>
                <button className="rounded-md border border-[#e8ece6] px-2.5 py-1.5 text-[9px] text-[#69756b]">
                  This month⌄
                </button>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-[#879188]">Total income</p>
                    <p className="mt-1 text-[25px] font-semibold tracking-[-.045em]">₹ 42,800</p>
                    <p className="mt-1 flex items-center gap-1 text-[9px] text-[#6c8b61]">
                      <Icon name="trend" size={12} /> 14.5%{" "}
                      <span className="text-[#9aa39b]">vs. September</span>
                    </p>
                  </div>
                  <div className="flex h-[62px] items-end gap-1.5">
                    {[31, 45, 36, 57, 48, 68, 54, 76, 61, 82, 66, 91].map((height, i) => (
                      <span
                        key={i}
                        className={`w-[9px] rounded-t-[3px] ${i === 11 ? "bg-[#56754d]" : "bg-[#dce7d5]"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="my-5 border-t border-[#edf0eb]" />
                <div className="space-y-3">
                  <FinanceLine
                    label="Membership fees"
                    amount="₹ 28,000"
                    percent="65%"
                    width="65%"
                    color="bg-[#78956a]"
                  />
                  <FinanceLine
                    label="Workshop registrations"
                    amount="₹ 14,800"
                    percent="35%"
                    width="35%"
                    color="bg-[#d6ad81]"
                  />
                </div>
                <a
                  href="#accounts-ledger"
                  className="mt-5 flex h-9 items-center justify-center gap-2 rounded-lg border border-[#e5eae3] text-[10px] font-medium text-[#455d47] transition hover:bg-[#f8faf6]"
                >
                  Open accounts ledger <Icon name="arrow" size={14} />
                </a>
              </CardContent>
            </Card>
          </div>
          <footer className="mt-7 flex flex-col justify-between gap-1 border-t border-[#e8ece6] pt-4 text-[9px] text-[#9ba49c] sm:flex-row">
            <span>© 2026 Pune Camera Photography Association</span>
            <span>
              Made for the love of photography <span className="text-[#bc806c]">♥</span>
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}

function Metric({
  title,
  value,
  change,
  caption,
  icon,
  accent,
}: {
  title: string;
  value: string;
  change: string;
  caption: string;
  icon: string;
  accent: string;
}) {
  return (
    <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
      <CardContent className="p-4 sm:p-[18px]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium text-[#818b82]">{title}</p>
          <span
            className={`flex size-8 items-center justify-center rounded-lg ${accent === "green" ? "bg-[#edf4e8] text-[#69875d]" : accent === "peach" ? "bg-[#fbf0e7] text-[#b9835c]" : accent === "blue" ? "bg-[#edf1f6] text-[#6c8098]" : "bg-[#f7f1df] text-[#aa8c48]"}`}
          >
            <Icon name={icon} size={16} />
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="text-[25px] font-semibold tracking-[-.045em] text-[#26342a]">{value}</p>
          {accent !== "yellow" && (
            <span className="mb-1 flex items-center gap-1 text-[9px] font-medium text-[#648356]">
              <Icon name="trend" size={11} />
              {change}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[9px] text-[#929b93]">
          <span className={accent === "yellow" ? "text-[#ad8740]" : "text-[#6c8b61]"}>
            {accent === "yellow" ? "●" : `+${change}`}
          </span>
          {caption}
        </div>
      </CardContent>
    </Card>
  );
}

function Avatar({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    sage: "bg-[#e0ebd9] text-[#54704b]",
    peach: "bg-[#f5e3d7] text-[#96684b]",
    blue: "bg-[#e0e9f1] text-[#5e758c]",
    lavender: "bg-[#eee5f2] text-[#82678e]",
  };
  return (
    <span
      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${colors[color] ?? colors.sage}`}
    >
      {label}
    </span>
  );
}

function FinanceLine({
  label,
  amount,
  percent,
  width,
  color,
}: {
  label: string;
  amount: string;
  percent: string;
  width: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-2 text-[#7e8980]">
          <span className={`size-2 rounded-sm ${color}`} />
          {label}
        </span>
        <span className="font-medium text-[#455148]">
          {amount}
          <span className="ml-2 text-[9px] font-normal text-[#9ca59d]">{percent}</span>
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#f0f2ee]">
        <div className={`h-full rounded-full ${color}`} style={{ width }} />
      </div>
    </div>
  );
}
