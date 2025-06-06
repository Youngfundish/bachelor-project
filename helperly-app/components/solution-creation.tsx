"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CreateSolutionSchema, createSolutionSchema } from "@/types/solution"

interface CreateSolutionProps {
  userEmail?: string;
  token?: string;
}

export default function CreateSolutionPage({userEmail, token}: CreateSolutionProps) {
  const router = useRouter()
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
      email: userEmail,
    },
  })

  async function onSubmit(values: CreateSolutionSchema) {
    console.log("🚀 onSubmit triggered", values);
    setIsSubmitting(true)
    const backendPayload = {
      ...values,
      kind: "simpleSolution", // default value
      mode: "createFromNew",  // default value
      status: "draft",        // default value
      defaultSectionId: "",
      defaultSectionName: "",
      defaultSubSectionId: "",
      defaultSubSectionName: "",
      defaultEventId: "",
      defaultEventName: "",
      content: "",
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_SERVICE}/solutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backendPayload),
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
    } catch (error) {
      console.error("Error creating solution:", error)
      toast.error(`Error: ${error}`)
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

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details about your solution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Name</label>
              <Input {...form.register("name")} placeholder="Solution name" />
              {form.formState.errors.name && <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <Textarea {...form.register("description")} placeholder="Solution description" />
              {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <Input {...form.register("location")} placeholder="Location" />
              {form.formState.errors.location && <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Email</label>
              <Input type="email" {...form.register("email")} placeholder="your.email@example.com" />
              {form.formState.errors.email && <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>}
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
              <Textarea {...form.register("problem")} placeholder="Problem description" />
              {form.formState.errors.problem && <p className="text-red-500 text-sm">{form.formState.errors.problem.message}</p>}
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
              <Input {...form.register("solutionDetails.title")} placeholder="Solution Title" />
              {form.formState.errors.solutionDetails?.title && <p className="text-red-500 text-sm">{form.formState.errors.solutionDetails.title.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Solution Description</label>
              <Textarea {...form.register("solutionDetails.description")} placeholder="Solution Description" />
              {form.formState.errors.solutionDetails?.description && <p className="text-red-500 text-sm">{form.formState.errors.solutionDetails.description.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Root Cause</label>
              <Textarea {...form.register("solutionDetails.rootCause")} placeholder="Root Cause" />
              {form.formState.errors.solutionDetails?.rootCause && <p className="text-red-500 text-sm">{form.formState.errors.solutionDetails.rootCause.message}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Countermeasure</label>
              <Textarea {...form.register("solutionDetails.countermeasure")} placeholder="Countermeasure" />
              {form.formState.errors.solutionDetails?.countermeasure && <p className="text-red-500 text-sm">{form.formState.errors.solutionDetails.countermeasure.message}</p>}
            </div>
          </CardContent>
        </Card>

          <Button type="submit">
            Create Solution
          </Button>
      </form>
    </div>
  )
}
