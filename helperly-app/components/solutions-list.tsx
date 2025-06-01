"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, PlusCircle } from "lucide-react"
import { SolutionSchema } from "@/types/solution"

export default function SolutionsList() {
  const [solutions, setSolutions] = useState<SolutionSchema[]>([])

  useEffect(() => {
    const fetchSolutions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions`);
            if (!response.ok) {
                throw new Error('Failed to fetch solutions');
            }
            const data = await response.json();
            setSolutions(data);
        } catch (error) {
            
        }
    };

    fetchSolutions().then(r => r);
}, []);

  if (solutions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-xl font-semibold mb-2">No solutions found</h3>
        <p className="text-muted-foreground mb-6">Get started by creating your first solution</p>
        <Link href="/solutions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Solution
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {solutions.map((solution) => (
        <Card key={solution.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="line-clamp-1">{solution.name}</CardTitle>
              <Badge
                variant={
                  solution.status === "draft"
                    ? "default"
                    : solution.status === "published"
                      ? "secondary"
                          : "destructive"
                }
              >
                {solution.status}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">{solution.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kind:</span>
                <span className="text-sm text-muted-foreground">{solution.kind}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm text-muted-foreground">{solution.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mode:</span>
                <span className="text-sm text-muted-foreground">{solution.mode}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/solutions/${solution.id}`}>
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </Link>
            <Link href={`/solutions/${solution.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
