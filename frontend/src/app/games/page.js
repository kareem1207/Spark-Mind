import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import GamesClient from "@/components/GamesClient";

export default async function Games() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <GamesClient session={session} />;
}
