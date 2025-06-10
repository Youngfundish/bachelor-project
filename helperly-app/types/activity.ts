import { z } from "zod";

export const dailyStatsSchema = z.array(
    z.object({
      date: z.string(),           // ISO date string: "YYYY-MM-DD"
      logins: z.number(),
      solutions: z.number(),
      uniqueUsers: z.number(),
    })
  );
  
  export type DailyStats = z.infer<typeof dailyStatsSchema>;


export const overallStatsSchema = z.object({
  overview: z.object({
    totalLogins: z.number(),
    totalSolutions: z.number(),
    totalUniqueUsers: z.number(),
    totalActivities: z.number(),
  }),
  last24Hours: z.object({
    logins: z.number(),
    solutions: z.number(),
    total: z.number(),
  }),
  recentActivity: z.array(z.any()), // You can replace z.any() with ActivityLog schema if you want it fully typed
});

export type OverallStatsSchema = z.infer<typeof overallStatsSchema>;
