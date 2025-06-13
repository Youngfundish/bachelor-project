import LoginPage from "@/components/login";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Login() {
   const session = await getServerSession(authOptions)
      if (session) {
          redirect('/');
      }
  return (
    <LoginPage />
  );
}
