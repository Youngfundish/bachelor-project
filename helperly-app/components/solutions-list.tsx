"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import debounce from "lodash.debounce"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Search } from "lucide-react"
import { SolutionSchema } from "@/types/solution"

interface TokenProps {
  token?: string
}

export default function SolutionsList({ token }: TokenProps) {
  const [solutions, setSolutions] = useState<SolutionSchema[]>([])
  const [query, setQuery] = useState("")

  // Debounced fetch to avoid hammering the server on every keystroke
  const fetchSolutions = useCallback(
    debounce(async (searchQuery: string) => {
      try {
        // Build the URL based on whether we have a search term or not
        const url = searchQuery.trim().length > 0
          ? `${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions/search?q=${encodeURIComponent(searchQuery)}`
          : `${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions`
                
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!res.ok) throw new Error("Failed to fetch solutions")
        
        const data = await res.json()
        setSolutions(data)
      } catch (e) {
        console.error(e)
      }
    }, 300),
    [token]
  )

  // Trigger the fetch whenever token or query changes
  useEffect(() => {
    fetchSolutions(query)
    // cancel any pending debounce on unmount
    return () => {
      fetchSolutions.cancel()
    }
  }, [fetchSolutions, query])

  return (
    <div>
      {/* Search bar */}
      <div className="mb-6 flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search solutions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring"
        />
      </div>

      {/* No results */}
      {solutions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-semibold mb-2">
            {query ? "No matches found" : "No solutions yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {query
              ? `Try a different search term.`
              : `Get started by creating your first solution.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, index) => (
            <Card key={sol.id ?? `solution-${index}`} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-1">
                    {sol.name}
                  </CardTitle>
                  <Badge
                    variant={
                      sol.status === "draft"
                        ? "default"
                        : sol.status === "published"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {sol.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {sol.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Kind:</span>
                    <span className="text-sm text-muted-foreground">
                      {sol.kind}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Location:</span>
                    <span className="text-sm text-muted-foreground">
                      {sol.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Section:</span>
                    <span className="text-sm text-muted-foreground">
                      {sol.defaultSectionName}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/solutions/${sol.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </Link>
                <Link href={`/solutions/${sol.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}