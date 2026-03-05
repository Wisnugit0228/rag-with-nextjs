import RolesClient from "./_components/roles-client";
import { environment } from "@/config/environments";

export default async function RolesPage() {
  const { BASE_API_URL } = environment;
  const res = await fetch(`${BASE_API_URL}/api/roles`, {
    cache: "no-store",
  });

  const data = await res.json();

  return (
    <div className="p-6">
      <RolesClient data={data} />
    </div>
  );
}
