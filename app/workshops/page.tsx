import { Suspense } from "react";
import WorkshopsDirectory from "@/components/workshops-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default function WorkshopsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading workshops...</div>}>
      <WorkshopsContent />
    </Suspense>
  );
}

async function WorkshopsContent() {
  return <WorkshopsDirectory readOnly={await isReadOnlyAdmin()} />;
}
