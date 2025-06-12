"use client"
import { ArrowUpRight, Bot, Globe2, LayoutDashboard, Moon, Sun, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { OverallStatsSchema } from "@/types/activity"


export default function DashboardPage() {
  const {data: session} = useSession()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [actvity, setActivity] = useState<OverallStatsSchema | null>(null)
  

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/analysis/overview`,{
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${session?.token}`
            }
          });
          if (!response.ok) {
              throw new Error('Failed to fetch activity');
          }
          const data = await response.json();
          setActivity(data);
      } catch (error) {
          console.log(error)
      }
  };

  fetchSolutions().then(r => r);
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (actvity === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-semibold mb-2">No actvity found</h3>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-8 bg-background text-foreground ${isDarkMode ? "dark" : ""}`}>
      <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Activity Analytics Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div><Tabs defaultValue="overview" className="space-y-4 mt-6">
            <TabsList>
              <TabsTrigger value="overview">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actvity.overview.totalLogins}</div>
                    <p className="text-xs text-muted-foreground">+{actvity.last24Hours.logins} logins last 24h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Unique Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actvity.overview.totalUniqueUsers}</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Solutions</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actvity.overview.totalSolutions}</div>
                    <p className="text-xs text-muted-foreground">+{actvity.last24Hours.solutions} from last 24h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                    <Globe2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{actvity.overview.totalActivities}</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>Monthly active users over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
    </div>
  )
}
