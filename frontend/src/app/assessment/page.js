import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AssessmentClient from "@/components/AssessmentClient";

export default async function AssessmentPage() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return <AssessmentClient />;
}
