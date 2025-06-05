// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { Button } from "@/components/ui/button"
// import { Form } from "@/components/ui/form"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { solutionKinds, solutionModes, solutionStatuses } from "@/lib/mock-data"
// import BasicInfoForm from "@/components/form-sections/basic-info-form"
// import LocationInfoForm from "@/components/form-sections/location-info-form"
// import DefaultSettingsForm from "@/components/form-sections/default-settings-form"
// import SolutionDetailsForm from "@/components/form-sections/solution-details-form"
// import { solutionSchema, SolutionSchema } from "@/types/solution"




// type SolutionFormProps = {
//   initialData?: SolutionSchema | null
// }

// export default function SolutionForm({ initialData }: SolutionFormProps) {
//   const router = useRouter()
//   const [activeTab, setActiveTab] = useState("basic-info")
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<SolutionSchema>({
//     resolver: zodResolver(solutionSchema),
//     defaultValues:{
//       id: "",
//       name: "",
//       title: "",
//       description: "",
//       kind: "simpleSolution",
//       status: "draft",
//       location: "",
//       mode: "createFromNew",
//       email: "",
//       defaultSectionName: "",
//       defaultSubSectionName: "",
//       defaultEventId: "",
//       defaultEventName: "",
//       solutionDetails: {
//         title: "",
//         description: "",
//         rootCause: "",
//         countermeasure: "",
//       },
//     },
//   })

//   useEffect(() => {
//     if (initialData) {
//       form.reset(initialData)
//     }
//   }, [initialData, form])

//   function onSubmit(values: SolutionSchema) {
//     setIsSubmitting(true)

//     // In a real app, this would be an API call
//     console.log("Form submitted:", values)

//     // Simulate API delay
//     setTimeout(() => {
//       setIsSubmitting(false)
//       router.push("/")
//     }, 1000)
//   }

//   const nextTab = () => {
//     if (activeTab === "basic-info") setActiveTab("location-info")
//     else if (activeTab === "location-info") setActiveTab("default-settings")
//     else if (activeTab === "default-settings") setActiveTab("solution-details")
//   }

//   const prevTab = () => {
//     if (activeTab === "solution-details") setActiveTab("default-settings")
//     else if (activeTab === "default-settings") setActiveTab("location-info")
//     else if (activeTab === "location-info") setActiveTab("basic-info")
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-4 mb-6">
//             <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
//             <TabsTrigger value="location-info">Location</TabsTrigger>
//             <TabsTrigger value="default-settings">Defaults</TabsTrigger>
//             <TabsTrigger value="solution-details">Solution Details</TabsTrigger>
//           </TabsList>

//           <TabsContent value="basic-info">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Basic Information</CardTitle>
//                 <CardDescription>Enter the basic details of your solution</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <BasicInfoForm form={form} solutionKinds={solutionKinds} solutionStatuses={solutionStatuses} />
//                 <div className="flex justify-end mt-6">
//                   <Button type="button" onClick={nextTab}>
//                     Next
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="location-info">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Location Information</CardTitle>
//                 <CardDescription>Enter location and contact details</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <LocationInfoForm form={form} solutionModes={solutionModes} />
//                 <div className="flex justify-between mt-6">
//                   <Button type="button" variant="outline" onClick={prevTab}>
//                     Previous
//                   </Button>
//                   <Button type="button" onClick={nextTab}>
//                     Next
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="default-settings">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Default Settings</CardTitle>
//                 <CardDescription>Configure default section, subsection, and event settings</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <DefaultSettingsForm form={form} />
//                 <div className="flex justify-between mt-6">
//                   <Button type="button" variant="outline" onClick={prevTab}>
//                     Previous
//                   </Button>
//                   <Button type="button" onClick={nextTab}>
//                     Next
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="solution-details">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Solution Details</CardTitle>
//                 <CardDescription>Provide detailed information about the solution</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <SolutionDetailsForm form={form} />
//                 <div className="flex justify-between mt-6">
//                   <Button type="button" variant="outline" onClick={prevTab}>
//                     Previous
//                   </Button>
//                   <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? "Saving..." : initialData ? "Update Solution" : "Create Solution"}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </form>
//     </Form>
//   )
// }
