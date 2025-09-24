import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SpeechTestClient from "@/components/games/SpeechTestClient";

export default async function SpeechTest() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <SpeechTestClient />;
}
