import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import MemoryGameClient from "@/components/games/MemoryGameClient";

export default async function MemoryGame() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <MemoryGameClient />;
}
