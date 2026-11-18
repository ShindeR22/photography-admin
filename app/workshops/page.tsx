import WorkshopsDirectory from "@/components/workshops-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default async function WorkshopsPage() {
  return <WorkshopsDirectory readOnly={await isReadOnlyAdmin()} />;
}
