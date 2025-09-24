import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResultsClient from "@/components/ResultsClient";

export default async function Results() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <ResultsClient session={session} />;
}
