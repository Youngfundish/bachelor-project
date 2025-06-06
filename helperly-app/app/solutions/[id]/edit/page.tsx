"use client"

import { useEffect, useState } from "react"
import { redirect, useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SolutionForm from "@/components/solution-form"
import { SolutionSchema } from "@/types/solution"
import { useSession } from "next-auth/react"

export default function EditSolutionPage() {
  useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login")
    },
  })
  const params = useParams()
  const router = useRouter()
  const [solution, setSolution] = useState<SolutionSchema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSolution = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch solutions');
            }
            const data = await response.json();
            setSolution(data);
        } catch (error) {
            console.log(error)
        }
    };
  fetchSolution().then(r => r);
  setLoading(false)
}, [params.id, router])

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-background text-foreground">
        <Card>
          <CardContent className="p-10 text-center">
            <p>Loading solution...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <Card>
        <CardHeader>
          <CardTitle>Edit Solution</CardTitle>
          <CardDescription>Update the details of your solution</CardDescription>
        </CardHeader>
        <CardContent>
          <SolutionForm initialData={solution} />
        </CardContent>
      </Card>
    </div>
  )
}
