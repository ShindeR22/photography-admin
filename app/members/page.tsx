import MembersDirectory from "@/components/members-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default async function MembersPage() {
  return <MembersDirectory readOnly={await isReadOnlyAdmin()} />;
}
