import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function DefaultSettingsForm({ form }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="defaultSectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Section ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter section ID" {...field} />
              </FormControl>
              <FormDescription>Unique identifier for the default section</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultSectionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Section Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter section name" {...field} />
              </FormControl>
              <FormDescription>Name of the default section</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="defaultSubSectionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Subsection ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter subsection ID" {...field} />
              </FormControl>
              <FormDescription>Unique identifier for the default subsection</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultSubSectionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Subsection Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter subsection name" {...field} />
              </FormControl>
              <FormDescription>Name of the default subsection</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="defaultEventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Event ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter event ID" {...field} />
              </FormControl>
              <FormDescription>Unique identifier for the default event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultEventName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Event Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter event name" {...field} />
              </FormControl>
              <FormDescription>Name of the default event</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
