import DashboardPage from "@/components/dashboard";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ActivitiesPage() {
  const session = await getServerSession(authOptions)
    if (session?.user.role?.toLocaleLowerCase() != "admin") {
        redirect('/');
    }
  return (
    <DashboardPage />
  );
}
