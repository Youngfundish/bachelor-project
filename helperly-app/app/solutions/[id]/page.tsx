"use client"

import { useEffect, useState } from "react"
import { redirect, useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SolutionSchema } from "@/types/solution"
import { useSession } from "next-auth/react"

export default function SolutionDetailPage() {
  const { data: session } = useSession({
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
              const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions/${params.id}`,{
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session?.token}`
          }});
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
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Solutions
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{solution?.name}</CardTitle>
              <CardDescription className="mt-2">
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge>{solution?.status}</Badge>
                  <Badge variant="outline">{solution?.kind}</Badge>
                  <Badge variant="outline">{solution?.mode}</Badge>
                </div>
              </CardDescription>
            </div>
            <Link href={`/solutions/${solution?.id}/edit`}>
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Solution
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Solution Details</TabsTrigger>
          <TabsTrigger value="defaults">Default Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Basic information about the solution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p>{solution?.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-md font-semibold mb-2">Solution Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{solution?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Title:</span>
                        <span>{solution?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Kind:</span>
                        <span>{solution?.kind}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span>{solution?.status}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-2">Location Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        <span>{solution?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Mode:</span>
                        <span>{solution?.mode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Contact:</span>
                        <span>{solution?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Solution Details</CardTitle>
              <CardDescription>Detailed information about the solution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{solution?.solutionDetails.title}</h3>
                  <p>{solution?.solutionDetails.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h3 className="text-md font-semibold mb-2">Root Cause</h3>
                    <p>{solution?.solutionDetails.rootCause}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold mb-2">Countermeasure</h3>
                    <p>{solution?.solutionDetails.countermeasure}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaults">
          <Card>
            <CardHeader>
              <CardTitle>Default Settings</CardTitle>
              <CardDescription>Default section, subsection, and event settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Section Name:</span>
                        <span>{solution?.defaultSectionName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Subsection Name:</span>
                        <span>{solution?.defaultSubSectionName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Event ID:</span>
                        <span>{solution?.defaultEventId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Event Name:</span>
                        <span>{solution?.defaultEventName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
