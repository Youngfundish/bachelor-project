import EditSolution from "@/components/solution-edit";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function EditSolutionPage() {
  const session = await getServerSession(authOptions)
        if (!session) {
            redirect('/login');
        }
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
          <EditSolution />
    </div>
  )
}
