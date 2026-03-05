import { environment } from "@/config/environments";
import UsersClient from "./_components/users-client";

const { BASE_API_URL } = environment;

export default async function UsersPage() {
  const res = await fetch(`${BASE_API_URL}/api/users`, {
    cache: "no-store",
  });

  const data = await res.json();
  return (
    <div className="p-6">
      <UsersClient data={data} />
    </div>
  );
}
