import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export default function ContentDetailsForm({ form }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="problem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Problem Statement</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the problem this solution addresses"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>A clear statement of the problem being solved</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="what"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What</FormLabel>
              <FormControl>
                <Textarea placeholder="What is the solution" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>What the solution entails</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="why"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why</FormLabel>
              <FormControl>
                <Textarea placeholder="Why this solution is needed" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Why this solution is important</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="where"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Where</FormLabel>
              <FormControl>
                <Textarea placeholder="Where the solution is implemented" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Where the solution is applied</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="when"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When</FormLabel>
              <FormControl>
                <Textarea placeholder="When the solution is implemented" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>Timeline or schedule for the solution</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="how"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How</FormLabel>
            <FormControl>
              <Textarea placeholder="How the solution works" className="min-h-[100px]" {...field} />
            </FormControl>
            <FormDescription>How the solution is implemented</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea placeholder="Detailed content of the solution" className="min-h-[150px]" {...field} />
            </FormControl>
            <FormDescription>Comprehensive details about the solution implementation</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
