import RegistrationsDirectory from "@/components/registrations-directory";
import { isReadOnlyAdmin } from "@/lib/current-admin";

export default async function RegistrationsPage() {
  return <RegistrationsDirectory readOnly={await isReadOnlyAdmin()} />;
}
