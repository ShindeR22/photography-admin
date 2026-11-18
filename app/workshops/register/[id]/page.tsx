"use client";

import { Suspense, use, useEffect, useState, type FormEvent } from "react";

type Workshop = {
  id: string;
  title: string;
  date: string;
  venue: string;
  registrationFee: number;
  description: string;
  mentorName: string;
  time: string;
  status: string;
  imageUrls?: string[];
  sponsors?: string[];
  arrangedBy: string | null;
  anchorName: string | null;
  guestName: string | null;
};

export default function WorkshopRegistrationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f7f8f5] px-4 py-10 text-center text-sm text-[#78847a]">Loading workshop...</main>}>
      <WorkshopRegistrationContent params={params} />
    </Suspense>
  );
}

function WorkshopRegistrationContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [memberNumber, setMemberNumber] = useState("PCPA-");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    fetch(`/api/public/workshops/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load workshop.");
        setWorkshop(result as Workshop);
      })
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : "Could not load workshop.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  async function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.memberNumber = hasMemberNumber ? memberNumber.trim() : "";

    try {
      const response = await fetch("/api/public/workshop-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workshopId: id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit registration.");
      setConfirmation(result.registration.registrationNumber);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit registration.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasMemberNumber = memberNumber.trim().length > "PCPA-".length;

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-10 text-[#1c2720] sm:px-6 sm:py-16">
      <section className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-[#e8ece6] bg-white shadow-[0_12px_40px_rgba(30,45,32,.08)]">
        <div className="bg-[#24362b] px-6 py-7 text-white sm:px-9">
          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#c9dfbd]">Pune Camera Photography Association</p>
          {workshop && <>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{workshop.title}</h1>
            <p className="mt-2 text-sm text-[#d2dbd2]">{workshop.description}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#d2dbd2]">
              <span>{new Date(workshop.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>{workshop.time}</span><span>{workshop.venue}</span>
            </div>
            <p className="mt-4 text-sm font-medium">Registration fee: ₹{workshop.registrationFee.toLocaleString("en-IN")} <span className="font-normal text-[#d2dbd2]">(active members get 50% off)</span></p>
          </>}
        </div>

        {workshop && <div className="space-y-6 p-6 sm:p-9">
          {(workshop.imageUrls ?? []).length > 0 && <section aria-label="Workshop photos">
            <h2 className="mb-3 text-sm font-semibold text-[#344037]">Workshop photos</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(workshop.imageUrls ?? []).map((url, index) => <a key={`${url}-${index}`} href={url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl bg-[#f2f4ef]">
                <img src={url} alt={`${workshop.title} photo ${index + 1}`} className="h-36 w-full object-cover transition hover:scale-[1.03] sm:h-44" />
              </a>)}
            </div>
          </section>}
          <section>
            <h2 className="mb-3 text-sm font-semibold text-[#344037]">Workshop details</h2>
            <dl className="grid grid-cols-1 gap-4 rounded-xl bg-[#f7f8f5] p-4 text-xs sm:grid-cols-2">
              <div><dt className="text-[#89938b]">Mentor</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.mentorName || "—"}</dd></div>
              <div><dt className="text-[#89938b]">Status</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.status}</dd></div>
              <div><dt className="text-[#89938b]">Arranged by</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.arrangedBy || "—"}</dd></div>
              <div><dt className="text-[#89938b]">Workshop anchor</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.anchorName || "—"}</dd></div>
              <div><dt className="text-[#89938b]">Guest / invitee</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.guestName || "—"}</dd></div>
              <div className="sm:col-span-2"><dt className="text-[#89938b]">Sponsors & contributions</dt><dd className="mt-1 font-medium text-[#344037]">{workshop.sponsors?.join(", ") || "—"}</dd></div>
            </dl>
          </section>
        </div>}

        <div className="p-6 sm:p-9">
          {isLoading && <p className="py-8 text-center text-sm text-[#78847a]">Loading workshop…</p>}
          {!isLoading && loadError && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{loadError}</p>}
          {confirmation && <div role="status" className="rounded-xl bg-[#edf4e9] p-5 text-center">
            <h2 className="text-lg font-semibold text-[#314c35]">Registration received</h2>
            <p className="mt-2 text-sm text-[#536352]">Your registration number is <strong>{confirmation}</strong>.</p>
          </div>}
          {!isLoading && workshop && !loadError && !confirmation && <>
            <h2 className="text-lg font-semibold">Register for this workshop</h2>
            <p className="mt-1 text-xs text-[#7f8a80]">Enter your member number for the member fee. Non-members can leave it blank and fill in their details.</p>
            <form onSubmit={submitRegistration} className="mt-6 space-y-4">
              <label className="block text-xs font-medium text-[#556158]">Member number <span className="font-normal text-[#929c93]">(optional)</span>
                <input name="memberNumber" value={memberNumber} onChange={(event) => { const value = event.target.value; setMemberNumber(`PCPA-${value.replace(/^PCPA-/i, "").toUpperCase()}`); }} maxLength={40} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe5dc] px-3 text-sm outline-none focus:border-[#91aa81] focus:ring-2 focus:ring-[#91aa81]/20" placeholder="PCPA-001" />
              </label>
              {!hasMemberNumber && <div className="space-y-4 border-t border-[#edf0eb] pt-4">
                <label className="block text-xs font-medium text-[#556158]">Full name<input name="name" required maxLength={120} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe5dc] px-3 text-sm outline-none focus:border-[#91aa81]" /></label>
                <label className="block text-xs font-medium text-[#556158]">Phone number<input name="phoneNumber" required maxLength={30} type="tel" className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe5dc] px-3 text-sm outline-none focus:border-[#91aa81]" /></label>
                <label className="block text-xs font-medium text-[#556158]">Studio name<input name="studioName" required maxLength={180} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe5dc] px-3 text-sm outline-none focus:border-[#91aa81]" /></label>
                <label className="block text-xs font-medium text-[#556158]">Address<textarea name="address" required maxLength={500} rows={3} className="mt-1.5 w-full rounded-lg border border-[#dfe5dc] px-3 py-2 text-sm outline-none focus:border-[#91aa81]" /></label>
                <label className="block text-xs font-medium text-[#556158]">Profession<input name="profession" required maxLength={120} className="mt-1.5 h-11 w-full rounded-lg border border-[#dfe5dc] px-3 text-sm outline-none focus:border-[#91aa81]" placeholder="e.g. Photographer" /></label>
              </div>}
              {submitError && <p role="alert" className="text-xs text-red-600">{submitError}</p>}
              <button type="submit" disabled={isSubmitting} className="h-11 w-full rounded-lg bg-[#314c35] text-sm font-medium text-white transition hover:bg-[#263d2a] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Submitting…" : "Submit registration"}</button>
            </form>
          </>}
        </div>
      </section>
    </main>
  );
}
