"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MobileSidebar from "@/app/components/mobile-sidebar";
import AppSidebar from "@/app/components/app-sidebar";

type MemberStatus = "Active" | "Pending" | "Expired";
type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Annual" | "Lifetime" | "Student";
  joined: string;
  expires: string;
  status: MemberStatus;
  avatar: string;
  tone: string;
};

type MemberRecord = {
  id: string;
  memberNumber: string;
  name: string;
  email: string;
  phone: string;
  membershipType: Member["type"];
  joinedAt: string;
  expiresAt: string | null;
  status: MemberStatus;
  address?: string;
  studioName?: string;
  aadhaarNumber?: string;
  udyamAadhaar?: string;
  membershipFee?: number;
  membershipPeriodYears?: number;
  experienceYears?: number;
  bloodGroup?: string;
  professions?: string[];
  camerasUsed?: string[];
  photoUrl?: string;
  aadhaarPhotoUrl?: string;
  udyamAadhaarPhotoUrl?: string;
  registrationDate?: string;
};

function formatMemberDate(value: string | null) {
  if (!value) return "Lifetime";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function todayForDateInput() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function memberFromRecord(record: MemberRecord, index: number): Member {
  const initials = record.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const tones = ["sage", "peach", "blue", "lavender", "rose", "yellow"];

  return {
    id: record.memberNumber,
    name: record.name,
    email: record.email,
    phone: record.phone || "—",
    type: record.membershipType,
    joined: formatMemberDate(record.joinedAt),
    expires: formatMemberDate(record.expiresAt),
    status: record.status,
    avatar: initials,
    tone: tones[index % tones.length],
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
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
    filter: (
      <>
        <path d="M4 7h16M7 12h10m-7 5h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
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
      {shapes[name] ?? shapes.users}
    </svg>
  );
}

export default function MembersDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberRecords, setMemberRecords] = useState<MemberRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MemberRecord | null>(null);
  const [editingMember, setEditingMember] = useState<MemberRecord | null>(null);
  const [approvingMemberId, setApprovingMemberId] = useState("");
  const [statusActionError, setStatusActionError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All members");
  const [type, setType] = useState("All types");
  const [activeTab, setActiveTab] = useState("All members");
  const [showAddForm, setShowAddForm] = useState(false);
  const [memberPhotoUrl, setMemberPhotoUrl] = useState("");
  const [aadhaarPhotoUrl, setAadhaarPhotoUrl] = useState("");
  const [udyamPhotoUrl, setUdyamPhotoUrl] = useState("");
  const [udyamNumber, setUdyamNumber] = useState("");
  const [photoUploadError, setPhotoUploadError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState("");

  async function uploadMemberPhoto(file: File | undefined, kind: string, setUrl: (url: string) => void) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setPhotoUploadError("Choose an image file smaller than 10 MB.");
      return;
    }
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      setPhotoUploadError("Cloudinary is not configured.");
      return;
    }
    setUploadingPhoto(kind);
    setPhotoUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);
      body.append("folder", "pcpa/members");
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok || typeof result.secure_url !== "string") throw new Error(result.error?.message || "Could not upload photo.");
      setUrl(result.secure_url);
    } catch (error) {
      setPhotoUploadError(error instanceof Error ? error.message : "Could not upload photo.");
    } finally {
      setUploadingPhoto("");
    }
  }

  useEffect(() => {
    let isActive = true;
    fetch("/api/members")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load members.");
        if (isActive) {
          setMemberRecords(result);
          setMembers(
            result.map((record: MemberRecord, index: number) => memberFromRecord(record, index)),
          );
        }
      })
      .catch((error: unknown) => {
        if (isActive)
          setLoadError(error instanceof Error ? error.message : "Could not load members.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const visibleMembers = useMemo(
    () =>
      members.filter((member) => {
        const needle = query.trim().toLowerCase();
        const matchesSearch =
          !needle ||
          [member.name, member.email, member.id, member.phone].some((value) =>
            value.toLowerCase().includes(needle),
          );
        const matchesStatus = status === "All members" || member.status === status;
        const matchesType = type === "All types" || member.type === type;
        const matchesTab =
          activeTab === "All members" ||
          (activeTab === "Renewals due"
            ? member.status === "Expired"
            : member.status === "Pending");
        return matchesSearch && matchesStatus && matchesType && matchesTab;
      }),
    [members, query, status, type, activeTab],
  );

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    setSubmitError("");
    if (!memberPhotoUrl || !aadhaarPhotoUrl) {
      setSubmitError("Upload the member photo and Aadhaar card photo.");
      return;
    }
    if (udyamNumber.trim() && !udyamPhotoUrl) {
      setSubmitError("Upload the Udyam Aadhaar photo too.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(editingMember ? `/api/members/${editingMember.id}` : "/api/members", {
        method: editingMember ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"), email: formData.get("email"),
          address: formData.get("address"), phone: formData.get("phone"),
          studioName: formData.get("studioName"), aadhaarNumber: formData.get("aadhaarNumber"),
          udyamAadhaar: formData.get("udyamAadhaar"), membershipFee: formData.get("membershipFee"),
          experienceYears: formData.get("experienceYears"), bloodGroup: formData.get("bloodGroup"),
          membershipPeriodYears: formData.get("membershipPeriodYears"), registrationDate: formData.get("registrationDate"),
          professions: formData.getAll("professions"), camerasUsed: formData.getAll("camerasUsed"),
          photoUrl: memberPhotoUrl, aadhaarPhotoUrl, udyamAadhaarPhotoUrl: udyamPhotoUrl,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save the member.");
      const savedRecord = result as MemberRecord;
      setMembers((current) => editingMember
        ? current.map((member) => member.id === savedRecord.memberNumber ? memberFromRecord(savedRecord, current.indexOf(member)) : member)
        : [memberFromRecord(savedRecord, 0), ...current]);
      setMemberRecords((current) => editingMember
        ? current.map((record) => record.id === savedRecord.id ? savedRecord : record)
        : [savedRecord, ...current]);
      setQuery("");
      setStatus("All members");
      setType("All types");
      setActiveTab("All members");
      form.reset();
      setMemberPhotoUrl(""); setAadhaarPhotoUrl(""); setUdyamPhotoUrl(""); setUdyamNumber("");
      setEditingMember(null);
      setShowAddForm(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not save the member.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openAddForm() {
    setEditingMember(null);
    setSubmitError(""); setPhotoUploadError("");
    setMemberPhotoUrl(""); setAadhaarPhotoUrl(""); setUdyamPhotoUrl(""); setUdyamNumber("");
    setShowAddForm(true);
  }

  function openEditForm(record: MemberRecord) {
    setEditingMember(record);
    setSubmitError(""); setPhotoUploadError("");
    setMemberPhotoUrl(record.photoUrl ?? "");
    setAadhaarPhotoUrl(record.aadhaarPhotoUrl ?? "");
    setUdyamPhotoUrl(record.udyamAadhaarPhotoUrl ?? "");
    setUdyamNumber(record.udyamAadhaar ?? "");
    setShowAddForm(true);
  }

  async function approveMember(record: MemberRecord) {
    if (approvingMemberId) return;
    setApprovingMemberId(record.id);
    setStatusActionError("");
    try {
      const response = await fetch(`/api/members/${record.id}/approve`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not approve member.");
      const updated = result as MemberRecord;
      setMemberRecords((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMembers((current) => current.map((item) => item.id === updated.id || item.id === updated.memberNumber
        ? memberFromRecord(updated, current.indexOf(item))
        : item));
    } catch (error) {
      setStatusActionError(error instanceof Error ? error.message : "Could not approve member.");
    } finally {
      setApprovingMemberId("");
    }
  }

  async function softDeleteMember(record: MemberRecord) {
    if (!window.confirm(`Soft delete ${record.name}? The record will be hidden from the member directory but kept in MongoDB.`)) return;
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(`/api/members/${record.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete the member.");
      setMembers((current) => current.filter((member) => member.id !== record.memberNumber));
      setMemberRecords((current) => current.filter((item) => item.id !== record.id));
      setSelectedRecord(null);
      setEditingMember(null);
      setShowAddForm(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not delete the member.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeCount = members.filter((member) => member.status === "Active").length;
  const expiredCount = members.filter((member) => member.status === "Expired").length;
  const pendingCount = members.filter((member) => member.status === "Pending").length;
  const photoInputs: [string, string, string, (url: string) => void][] = [
    ["Member photo", "member", memberPhotoUrl, setMemberPhotoUrl],
    ["Aadhaar card photo", "aadhaar", aadhaarPhotoUrl, setAadhaarPhotoUrl],
    ["Udyam Aadhaar photo", "udyam", udyamPhotoUrl, setUdyamPhotoUrl],
  ];

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-[#1c2720]">
      <AppSidebar activeRoute="members" counts={{ members: members.length }} />

      <section className="lg:pl-[252px]">
        <header className="sticky top-0 z-10 flex h-[70px] items-center justify-between border-b border-[#e9ece6] bg-[#fbfcfa]/95 px-5 backdrop-blur-md sm:px-8 lg:px-10">
          <div className="flex items-center">
            <MobileSidebar navItems={[{ label: "Overview", href: "/", icon: "◫" }, { label: "Members", href: "/members", icon: "♧", active: true, count: members.length }, { label: "Workshops", href: "/workshops", icon: "▦" }, { label: "Registrations", href: "/registrations", icon: "▤" }]} summary={`${members.length} members`} />
            <div>
              <p className="text-[11px] text-[#8b948c]">
                Association / <span className="text-[#455248]">Members</span>
              </p>
              <p className="mt-0.5 text-sm font-semibold lg:hidden">Pune Camera Association</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Notifications"
              className="relative flex size-9 items-center justify-center rounded-lg text-[#68736a] hover:bg-[#eef1eb]"
            >
              <Icon name="bell" />
              <span className="absolute right-[8px] top-[7px] size-1.5 rounded-full bg-[#da8069] ring-2 ring-[#fbfcfa]" />
            </button>
            <div className="hidden h-7 w-px bg-[#e7ebe5] sm:block" />
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 sm:px-8 lg:px-10 lg:pt-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.14em] text-[#7d8f78]">
                Association directory
              </p>
              <h1 className="text-[28px] font-semibold tracking-[-.04em] text-[#1d2a21] sm:text-[32px]">
                Members
              </h1>
              <p className="mt-1.5 text-[13px] text-[#7b857d]">
                Manage your photography community and membership renewals.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="h-10 gap-2 rounded-lg border border-[#e0e6de] bg-white px-3.5 text-xs font-medium text-[#536256] shadow-sm hover:bg-[#f7f9f5]">
                <Icon name="download" size={15} /> Export
              </Button>
              <Button
                onClick={openAddForm}
                className="h-10 gap-2 rounded-lg bg-[#314c35] px-4 text-xs font-medium text-white shadow-sm hover:bg-[#263d2a]"
              >
                <Icon name="plus" size={16} /> Add member
              </Button>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            <Summary
              title="Total members"
              value={String(members.length)}
              note="Across all membership types"
              icon="users"
              tone="green"
            />
            <Summary
              title="Active members"
              value={String(activeCount)}
              note="Members with active status"
              icon="users"
              tone="blue"
            />
            <Summary
              title="Renewals due"
              value={String(expiredCount)}
              note="Members marked expired"
              icon="calendar"
              tone="yellow"
            />
            <Summary
              title="Pending approval"
              value={String(pendingCount)}
              note="Applications to review"
              icon="ticket"
              tone="peach"
            />
          </div>

          <Card className="rounded-xl border-[#e8ece6] bg-white py-0 shadow-[0_2px_10px_rgba(30,45,32,.025)]">
            <CardContent className="p-0">
              <div className="flex flex-col justify-between gap-3 border-b border-[#edf0eb] px-4 pt-4 sm:flex-row sm:items-center sm:px-5">
                <div className="flex gap-5 overflow-x-auto">
                  {["All members", "Renewals due", "Pending approval"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative whitespace-nowrap pb-3 text-[11px] font-medium transition ${activeTab === tab ? "text-[#38553b]" : "text-[#8c968e] hover:text-[#465449]"}`}
                    >
                      {tab}
                      {tab === "Pending approval" && (
                        <span className="ml-1.5 rounded-full bg-[#f5eee0] px-1.5 py-0.5 text-[9px] text-[#987340]">
                          {pendingCount}
                        </span>
                      )}
                      {activeTab === tab && (
                        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#55754c]" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="pb-3 text-[10px] text-[#9aa39b]">
                  Showing{" "}
                  <span className="font-medium text-[#59645c]">{visibleMembers.length}</span> of{" "}
                  {members.length} members
                </p>
              </div>
              <div className="flex flex-col gap-2.5 border-b border-[#edf0eb] p-4 sm:flex-row sm:items-center sm:px-5">
                <label className="relative flex-1">
                  <span className="sr-only">Search members</span>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#929c93]">
                    <Icon name="search" size={15} />
                  </span>
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="h-9 border-[#e7ebe5] bg-white pl-9 text-[11px] shadow-none placeholder:text-[#9da69e] focus-visible:ring-[#98b784]"
                    placeholder="Search by name, email, phone or member ID..."
                  />
                </label>
                <div className="flex gap-2">
                  <label className="relative">
                    <span className="sr-only">Filter by membership type</span>
                    <select
                      value={type}
                      onChange={(event) => setType(event.target.value)}
                      className="h-9 min-w-[132px] appearance-none rounded-md border border-[#e7ebe5] bg-white pl-3 pr-8 text-[10px] text-[#667168] outline-none focus:ring-2 focus:ring-[#98b784]"
                    >
                      <option>All types</option>
                      <option>Annual</option>
                      <option>Lifetime</option>
                      <option>Student</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#829087]">
                      ⌄
                    </span>
                  </label>
                  <label className="relative">
                    <span className="sr-only">Filter by status</span>
                    <select
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                      className="h-9 min-w-[132px] appearance-none rounded-md border border-[#e7ebe5] bg-white pl-3 pr-8 text-[10px] text-[#667168] outline-none focus:ring-2 focus:ring-[#98b784]"
                    >
                      <option>All members</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Expired</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#829087]">
                      ⌄
                    </span>
                  </label>
                  <Button
                    aria-label="More filters"
                    className="size-9 rounded-md border border-[#e7ebe5] bg-white text-[#68736a] hover:bg-[#f6f8f4]"
                  >
                    <Icon name="filter" size={16} />
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {statusActionError && <p role="alert" className="px-5 py-2 text-xs text-red-600">{statusActionError}</p>}
                <table className="w-full min-w-[840px] text-left">
                  <thead>
                    <tr className="bg-[#fafbf9] text-[9px] font-medium uppercase tracking-[.1em] text-[#9aa39b]">
                      <th className="px-5 py-3 font-medium">Member</th>
                      <th className="px-3 py-3 font-medium">Member ID</th>
                      <th className="px-3 py-3 font-medium">Membership</th>
                      <th className="px-3 py-3 font-medium">Joined</th>
                      <th className="px-3 py-3 font-medium">Renewal date</th>
                      <th className="px-3 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {visibleMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-[#f0f2ee] text-[10px] transition hover:bg-[#fbfcfa]"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar label={member.avatar} tone={member.tone} />
                            <div>
                              <p className="whitespace-nowrap text-[11px] font-medium text-[#37443a]">
                                {member.name}
                              </p>
                              <p className="mt-1 text-[9px] text-[#929c94]">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 font-medium text-[#657168]">{member.id}</td>
                        <td className="px-3 py-3.5">
                          <Badge
                            variant="outline"
                            className="rounded-md border-[#e8ece6] px-2 py-1 text-[9px] font-normal text-[#68736a]"
                          >
                            {member.type}
                          </Badge>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-[#737f75]">
                          {member.joined}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 text-[#737f75]">
                          {member.expires}
                        </td>
                        <td className="px-3 py-3.5">
                          <StatusBadge status={member.status} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setSelectedRecord(memberRecords.find((record) => record.memberNumber === member.id) ?? null)} className="rounded-md border border-[#e7ebe5] px-2 py-1 text-[10px] text-[#536256] hover:bg-[#f5f7f3]">View</button>
                            <button onClick={() => { const record = memberRecords.find((item) => item.memberNumber === member.id); if (record) openEditForm(record); }} className="rounded-md border border-[#e7ebe5] px-2 py-1 text-[10px] text-[#536256] hover:bg-[#f5f7f3]">Edit</button>
                            {member.status === "Pending" && <button onClick={() => { const record = memberRecords.find((item) => item.memberNumber === member.id); if (record) void approveMember(record); }} disabled={!!approvingMemberId} className="rounded-md bg-[#314c35] px-2 py-1 text-[10px] text-white hover:bg-[#263d2a] disabled:opacity-50">{approvingMemberId === memberRecords.find((item) => item.memberNumber === member.id)?.id ? "Approving…" : "Approve"}</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {isLoading && (
                  <p className="px-5 py-14 text-center text-xs text-[#8c968e]">
                    Loading members from the database…
                  </p>
                )}
                {!isLoading && loadError && (
                  <p role="alert" className="px-5 py-14 text-center text-xs text-red-600">
                    {loadError}
                  </p>
                )}
                {!isLoading && !loadError && visibleMembers.length === 0 && (
                  <div className="px-5 py-16 text-center">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-[#edf3e9] text-[#6d8562]">
                      <Icon name="search" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-[#405044]">No members found</p>
                    <p className="mt-1 text-xs text-[#8c968e]">
                      Try another search or change your filters.
                    </p>
                    <button
                      onClick={() => {
                        setQuery("");
                        setStatus("All members");
                        setType("All types");
                        setActiveTab("All members");
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
                    {visibleMembers.length ? 1 : 0}–{visibleMembers.length}
                  </span>{" "}
                  of <span className="font-medium text-[#59645c]">{visibleMembers.length}</span>{" "}
                  results
                </p>
                <span className="text-[10px] text-[#929c94]">Members from database</span>
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

      {selectedRecord && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#142019]/40 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedRecord(null); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="member-detail-title" className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#e7ebe5] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#78906f]">Member profile · {selectedRecord.memberNumber}</p><h2 id="member-detail-title" className="mt-1 text-lg font-semibold">{selectedRecord.name}</h2></div><button onClick={() => setSelectedRecord(null)} aria-label="Close" className="rounded-md px-2 py-1 text-lg text-[#859087]">×</button></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="flex flex-wrap gap-3 sm:col-span-2">{[["Member photo", selectedRecord.photoUrl], ["Aadhaar card", selectedRecord.aadhaarPhotoUrl], ["Udyam Aadhaar", selectedRecord.udyamAadhaarPhotoUrl]].filter(([, url]) => !!url).map(([label, url]) => <div key={label} className="w-36"><p className="mb-1 text-[10px] text-[#78837a]">{label}</p><a href={url} target="_blank" rel="noreferrer"><img src={url} alt={label} className="h-28 w-36 rounded-lg border border-[#e7ebe5] object-cover" /></a></div>)}</div>
              {[["Phone", selectedRecord.phone], ["Email", selectedRecord.email?.endsWith("@pcpa.invalid") ? "—" : selectedRecord.email], ["Address", selectedRecord.address], ["Studio", selectedRecord.studioName], ["Aadhaar number", selectedRecord.aadhaarNumber], ["Udyam Aadhaar", selectedRecord.udyamAadhaar], ["Membership fee", selectedRecord.membershipFee == null ? "—" : `₹${selectedRecord.membershipFee}`], ["Period", `${selectedRecord.membershipPeriodYears ?? 1} year(s)`], ["Registration date", formatMemberDate(selectedRecord.registrationDate ?? selectedRecord.joinedAt)], ["Expiry date", formatMemberDate(selectedRecord.expiresAt)], ["Experience", `${selectedRecord.experienceYears ?? 0} year(s)`], ["Blood group", selectedRecord.bloodGroup || "—"], ["Profession", selectedRecord.professions?.join(", ") || "—"], ["Cameras", selectedRecord.camerasUsed?.join(", ") || "—"], ["Status", selectedRecord.status]].map(([label, value]) => <div key={label}><p className="text-[10px] text-[#929c94]">{label}</p><p className="mt-1 break-words text-xs text-[#37443a]">{value || "—"}</p></div>)}
            </div>
            <div className="mt-6 flex justify-end"><Button onClick={() => { const record = selectedRecord; setSelectedRecord(null); openEditForm(record); }} className="h-9 rounded-lg bg-[#314c35] px-4 text-xs text-white">Edit member</Button></div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#142019]/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddForm(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-member-title"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#e7ebe5] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#78906f]">
                  Member directory
                </p>
                <h2 id="add-member-title" className="mt-1 text-lg font-semibold tracking-tight">
                  {editingMember ? "Edit member details" : "Add a new member"}
                </h2>
                {editingMember && <p className="mt-1 text-[10px] font-medium text-[#667168]">Member ID: {editingMember.memberNumber} · fixed</p>}
                <p className="mt-1 text-xs text-[#858f87]">
                  {editingMember ? "Update the saved member profile." : "Create a profile and review it before approval."}
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-lg leading-none text-[#859087] hover:bg-[#f2f4f0]"
              >
                ×
              </button>
            </div>
            <form onSubmit={addMember} className="mt-5 space-y-4">
              {submitError && (
                <p role="alert" className="text-xs text-red-600">
                  {submitError}
                </p>
              )}
              <label className="block text-[11px] font-medium text-[#556158]">
                Full name
                <Input
                  required
                  name="name"
                  defaultValue={editingMember?.name ?? ""}
                  className="mt-1.5 h-10 text-xs"
                  placeholder="e.g. Samira Joshi"
                />
              </label>
              <label className="block text-[11px] font-medium text-[#556158]">
                Email address (optional)
                <Input
                  name="email"
                  type="email"
                  defaultValue={editingMember?.email?.endsWith("@pcpa.invalid") ? "" : editingMember?.email ?? ""}
                  className="mt-1.5 h-10 text-xs"
                  placeholder="name@example.com"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[["Address", "address", "text"], ["Phone number", "phone", "tel"], ["Studio name", "studioName", "text"], ["Aadhaar card number", "aadhaarNumber", "text"], ["Udyam Aadhaar (optional)", "udyamAadhaar", "text"], ["Membership fee", "membershipFee", "number"], ["Photography experience (years)", "experienceYears", "number"]].map(([label, name, type]) => (
                  <label key={name} className="block text-[11px] font-medium text-[#556158]">{label}<Input name={name} type={type} defaultValue={editingMember ? ({ address: editingMember.address, phone: editingMember.phone, studioName: editingMember.studioName, aadhaarNumber: editingMember.aadhaarNumber, udyamAadhaar: editingMember.udyamAadhaar, membershipFee: editingMember.membershipFee, experienceYears: editingMember.experienceYears } as Record<string, string | number | undefined>)[name] ?? "" : ""} required={name === "aadhaarNumber"} onChange={name === "udyamAadhaar" ? (event) => setUdyamNumber(event.target.value) : undefined} inputMode={name === "aadhaarNumber" || name === "phone" ? "numeric" : undefined} maxLength={name === "aadhaarNumber" ? 12 : name === "phone" ? 10 : undefined} pattern={name === "aadhaarNumber" ? "[0-9]{12}" : name === "phone" ? "[6-9][0-9]{9}" : undefined} min={type === "number" ? "0" : undefined} step={name === "membershipFee" ? "0.01" : undefined} className="mt-1.5 h-10 text-xs" /></label>
                ))}
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-3">
                  {photoInputs.map(([label, kind, url, setter]) => (
                    <label key={kind} className="block text-[11px] font-medium text-[#556158]">{label}{kind === "udyam" && !udyamNumber.trim() ? " (optional)" : ""}<Input type="file" accept="image/*" disabled={!!uploadingPhoto} onChange={(event) => { void uploadMemberPhoto(event.target.files?.[0], kind, setter); event.currentTarget.value = ""; }} className="mt-1.5 h-10 cursor-pointer text-xs file:mr-2 file:rounded-md file:border-0 file:bg-[#edf3e9] file:px-2 file:py-1 file:text-[10px]" />{url ? <span className="mt-1 block text-[10px] text-green-700">Photo uploaded</span> : null}</label>
                  ))}
                </div>
                {photoUploadError && <p role="alert" className="sm:col-span-2 text-xs text-red-600">{photoUploadError}</p>}
                <label className="block text-[11px] font-medium text-[#556158]">Membership period (years)<Input name="membershipPeriodYears" type="number" required min="1" max="100" defaultValue={editingMember?.membershipPeriodYears ?? 1} className="mt-1.5 h-10 text-xs" /></label>
                <label className="block text-[11px] font-medium text-[#556158]">Registration date<Input name="registrationDate" type="date" required defaultValue={editingMember?.registrationDate?.slice(0, 10) ?? editingMember?.joinedAt.slice(0, 10) ?? todayForDateInput()} className="mt-1.5 h-10 text-xs" /></label>
                <label className="block text-[11px] font-medium text-[#556158]">Blood group (optional)<select name="bloodGroup" defaultValue={editingMember?.bloodGroup ?? ""} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-xs"><option value="">Select</option>{["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => <option key={group}>{group}</option>)}</select></label>
                <fieldset className="text-[11px] font-medium text-[#556158]"><legend>Profession</legend><div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">{["Photographer", "Cinematographer", "Video editor", "Photo editor", "Reel maker", "Other"].map((item) => <label key={item} className="flex items-center gap-1.5"><input type="checkbox" name="professions" value={item} defaultChecked={editingMember?.professions?.includes(item)} />{item}</label>)}</div></fieldset>
                <fieldset className="text-[11px] font-medium text-[#556158]"><legend>Cameras used</legend><div className="mt-2 flex flex-wrap gap-x-3 gap-y-2">{["Canon", "Sony", "Nikon", "Fujifilm", "Lumix"].map((item) => <label key={item} className="flex items-center gap-1.5"><input type="checkbox" name="camerasUsed" value={item} defaultChecked={editingMember?.camerasUsed?.includes(item)} />{item}</label>)}</div></fieldset>
              </div>
              <div className="flex items-center justify-between border-t border-[#edf0eb] pt-4">
                <p className="text-[10px] text-[#909990]">{editingMember ? "Member ID cannot be changed." : "New applications start as pending."}</p>
                <div className="flex gap-2">
                  {editingMember && <Button type="button" onClick={() => void softDeleteMember(editingMember)} disabled={isSubmitting} className="h-9 rounded-lg border border-red-200 bg-white px-3 text-xs text-red-700 hover:bg-red-50">Delete member</Button>}
                  <Button
                    onClick={() => setShowAddForm(false)}
                    className="h-9 rounded-lg border border-[#e4e9e2] bg-white px-3 text-xs text-[#5f6b62] hover:bg-[#f7f9f5]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-9 rounded-lg bg-[#314c35] px-3.5 text-xs text-white hover:bg-[#263d2a]"
                  >
                    {isSubmitting ? "Saving…" : editingMember ? "Save changes" : "Create member"}
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

function StatusBadge({ status }: { status: MemberStatus }) {
  const styles: Record<MemberStatus, string> = {
    Active: "bg-[#eaf3e4] text-[#557249]",
    Pending: "bg-[#fbf0dd] text-[#9a7134]",
    Expired: "bg-[#f7e8e5] text-[#a45f54]",
  };
  const dots: Record<MemberStatus, string> = {
    Active: "bg-[#7c9c6c]",
    Pending: "bg-[#c99b50]",
    Expired: "bg-[#c7796c]",
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
