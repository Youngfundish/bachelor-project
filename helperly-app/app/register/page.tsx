import RegistrationComponent from "@/components/registration-page"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RegistrationPage() {
    const session = await getServerSession(authOptions)
    if (session) {
        redirect('/');
    }
    return <RegistrationComponent />
}
