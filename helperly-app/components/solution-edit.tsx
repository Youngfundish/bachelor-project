"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  CreateSolutionSchema,
  createSolutionSchema,
  SolutionSchema,
} from "@/types/solution"
import { useSession } from "next-auth/react"

export default function EditSolution() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateSolutionSchema>({
    resolver: zodResolver(createSolutionSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      problem: "",
      title: "",
      solutionDetails: {
        title: "",
        description: "",
        rootCause: "",
        countermeasure: "",
      },
      email: "",
    },
  })

  // 1) Fetch existing solution and reset the form
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          }
        )
        if (!res.ok) throw new Error("Failed to load solution")
        const data: SolutionSchema = await res.json()

        // populate the form
        form.reset({
          name: data.name,
          description: data.description,
          location: data.location,
          problem: data.problem,
          title: data.title ?? "",
          solutionDetails: {
            title: data.solutionDetails?.title ?? "",
            description: data.solutionDetails?.description ?? "",
            rootCause: data.solutionDetails?.rootCause ?? "",
            countermeasure: data.solutionDetails?.countermeasure ?? "",
          },
          email: data.email ?? session?.user?.email ?? "",
        })
      } catch (err) {
        console.error(err)
        toast.error("Could not load solution")
        router.back()
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id, session?.token])

  // 2) onSubmit calls PUT to update
  async function onSubmit(values: CreateSolutionSchema) {
    setIsSubmitting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify(values),
        }
      )
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Update failed")
      }
      toast.success("Solution updated")
      router.push("/solutions")
    } catch (err) {
      console.error(err)
      toast.error(`Error: ${err}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <p>Loading…</p>
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Solution</h1>
        <p className="text-muted-foreground mt-2">
          Update the fields below and save your changes.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your solution’s main details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            {/* Description */}
            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            {/* Location */}
            <div>
              <label className="block font-medium mb-1">Location</label>
              <Input {...form.register("location")} />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input type="email" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Problem */}
        <Card>
          <CardHeader>
            <CardTitle>Problem</CardTitle>
            <CardDescription>Describe the problem you’re solving.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea {...form.register("problem")} />
            {form.formState.errors.problem && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.problem.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Solution Details */}
        <Card>
          <CardHeader>
            <CardTitle>Solution Details</CardTitle>
            <CardDescription>Update the detailed approach.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {(["title", "description", "rootCause", "countermeasure"] as const).map((field) => (
              <div key={field}>
                <label className="block font-medium mb-1">
                  {field === "title"
                    ? "Solution Title"
                    : field === "description"
                    ? "Solution Description"
                    : field === "rootCause"
                    ? "Root Cause"
                    : "Countermeasure"}
                </label>
                {field === "description" ||
                field === "rootCause" ||
                field === "countermeasure" ? (
                  <Textarea {...form.register(`solutionDetails.${field}`)} />
                ) : (
                  <Input {...form.register(`solutionDetails.${field}`)} />
                )}
                {form.formState.errors.solutionDetails?.[field] && (
                  <p className="text-red-500 text-sm">
                    {
                      (form.formState.errors.solutionDetails as any)[
                        field
                      ]?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
