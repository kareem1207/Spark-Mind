import { getAuthSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import ApiConfigClient from "@/components/ApiConfigClient"

export default async function ApiConfig() {
  const session = await getAuthSession()
  
  if (!session) {
    redirect('/auth/signin')
  }

  return <ApiConfigClient session={session} />
}