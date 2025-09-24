import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReportsClient from "@/components/ReportsClient";

export default async function Reports() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <ReportsClient session={session} />;
}
