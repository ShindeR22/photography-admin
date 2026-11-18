import { Suspense } from "react";
import RegistrationsDirectory from "@/components/registrations-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default function RegistrationsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading registrations...</div>}>
      <RegistrationsContent />
    </Suspense>
  );
}

async function RegistrationsContent() {
  return <RegistrationsDirectory readOnly={await isReadOnlyAdmin()} />;
}
