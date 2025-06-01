import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function SolutionDetailsForm({ form }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="solutionDetails.title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solution Details Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter solution details title" {...field} />
            </FormControl>
            <FormDescription>A title for the detailed solution information</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="solutionDetails.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Solution Details Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Detailed description of the solution" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormDescription>A comprehensive description of the solution details</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="solutionDetails.rootCause"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Root Cause</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the root cause of the problem" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormDescription>The underlying cause of the problem being addressed</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="solutionDetails.countermeasure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Countermeasure</FormLabel>
            <FormControl>
              <Textarea placeholder="Describe the countermeasure implemented" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormDescription>The specific actions taken to address the root cause</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
