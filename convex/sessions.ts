import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordSession = mutation({
  args: {
    installId: v.string(),
    date: v.string(),                   // "YYYY-MM-DD"
    exerciseNames: v.array(v.string()),
    durationMinutes: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const getRecentSessions = query({
  args: { installId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sessions")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .order("desc")
      .take(30);
  },
});
