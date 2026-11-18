import { Suspense } from "react";
import MembersDirectory from "@/components/members-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default function MembersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading members...</div>}>
      <MembersContent />
    </Suspense>
  );
}

async function MembersContent() {
  return <MembersDirectory readOnly={await isReadOnlyAdmin()} />;
}
