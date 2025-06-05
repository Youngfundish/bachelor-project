import CreateSolutionPage from "@/components/solution-creation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NewSolutionPage() {
  const session = await getServerSession(authOptions)
      if (!session) {
          redirect('/login');
      }
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <CreateSolutionPage />
    </div>
  )
}
