import SolutionsList from "@/components/solutions-list";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { PlusCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions)
    if (!session) {
        redirect('/login');
    }
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solutions</h1>
          <p className="text-muted-foreground mt-1">Browse our collection of solutions or create your own</p>
        </div>
        <Link href="/solutions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Solution
          </Button>
        </Link>
      </div>
      <SolutionsList />
    </div>
  );
}
