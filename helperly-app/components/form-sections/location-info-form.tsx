"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function LocationInfoForm({ form }) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter solution location" {...field} />
            </FormControl>
            <FormDescription>Where this solution is implemented</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact email" type="email" {...field} />
            </FormControl>
            <FormDescription>Email address of the solution owner or contact person</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
