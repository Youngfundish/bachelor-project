import CreateSolutionPage from "@/components/solution-creation";
import SolutionForm from "@/components/solution-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
