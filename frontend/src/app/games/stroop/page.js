import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import StroopGameClient from "@/components/games/StroopGameClient";

export default async function StroopGame() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <StroopGameClient />;
}
