"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const createSolutionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  content: z.string().min(1, "Content is required"),
  problem: z.string().min(1, "Problem description is required"),
  title: z.string().min(1, "Title is required"),
  solutionDetails: z.object({
    title: z.string().min(1, "Solution title is required"),
    description: z.string().min(1, "Solution description is required"),
    rootCause: z.string().min(1, "Root cause is required"),
    countermeasure: z.string().min(1, "Countermeasure is required"),
  }),
  email: z.string().email("Please enter a valid email address"),
})

type CreateSolutionSchema = z.infer<typeof createSolutionSchema>

export default function CreateSolutionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSolutionSchema>({
    resolver: zodResolver(createSolutionSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      content: "",
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

  async function onSubmit(values: CreateSolutionSchema) {
    console.log("🚀 onSubmit triggered", values);
    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.message || "Failed to create solution")
      }

      const responseData = await response.json()
      console.log("Solution created:", responseData)

      toast.success("Solution created successfully!")

      router.push("/solutions")
    } catch (error: any) {
      console.error("Error creating solution:", error)
      toast.error(`Error: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Solution</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to create a new solution entry.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details about your solution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input {...register("name")} placeholder="Solution name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea {...register("description")} placeholder="Solution description" />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <Input {...register("location")} placeholder="Location" />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input type="email" {...register("email")} placeholder="your.email@example.com" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Problem & Content */}
        <Card>
          <CardHeader>
            <CardTitle>Problem & Content</CardTitle>
            <CardDescription>Describe the problem and provide detailed content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Problem</label>
              <Textarea {...register("problem")} placeholder="Problem description" />
              {errors.problem && <p className="text-red-500 text-sm">{errors.problem.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Content</label>
              <Textarea {...register("content")} placeholder="Content" />
              {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Solution Details */}
        <Card>
          <CardHeader>
            <CardTitle>Solution Details</CardTitle>
            <CardDescription>Provide specific details about the solution approach.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Solution Title</label>
              <Input {...register("solutionDetails.title")} placeholder="Solution Title" />
              {errors.solutionDetails?.title && <p className="text-red-500 text-sm">{errors.solutionDetails.title.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Solution Description</label>
              <Textarea {...register("solutionDetails.description")} placeholder="Solution Description" />
              {errors.solutionDetails?.description && <p className="text-red-500 text-sm">{errors.solutionDetails.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Root Cause</label>
              <Textarea {...register("solutionDetails.rootCause")} placeholder="Root Cause" />
              {errors.solutionDetails?.rootCause && <p className="text-red-500 text-sm">{errors.solutionDetails.rootCause.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Countermeasure</label>
              <Textarea {...register("solutionDetails.countermeasure")} placeholder="Countermeasure" />
              {errors.solutionDetails?.countermeasure && <p className="text-red-500 text-sm">{errors.solutionDetails.countermeasure.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Submit button */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Create Solution
          </Button>
        </div>
      </form>
    </div>
  )
}
