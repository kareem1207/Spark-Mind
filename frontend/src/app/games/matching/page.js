import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MatchingGameClient from "@/components/games/MatchingGameClient";

export default async function MatchingGame() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <MatchingGameClient />;
}
