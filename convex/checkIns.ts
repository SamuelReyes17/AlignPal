import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Upserts a check-in for a given date. One check-in per day per device.
export const logCheckIn = mutation({
  args: {
    installId: v.string(),
    date: v.string(),           // "YYYY-MM-DD"
    painLevel: v.number(),      // 1-10
    exercisesDone: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("checkIns")
      .withIndex("by_installId_and_date", (q) =>
        q.eq("installId", args.installId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        painLevel: args.painLevel,
        exercisesDone: args.exercisesDone,
        notes: args.notes,
      });
      return existing._id;
    }

    return await ctx.db.insert("checkIns", args);
  },
});

export const getTodayCheckIn = query({
  args: { installId: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("checkIns")
      .withIndex("by_installId_and_date", (q) =>
        q.eq("installId", args.installId).eq("date", args.date)
      )
      .unique();
  },
});

export const getRecentCheckIns = query({
  args: { installId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("checkIns")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .order("desc")
      .take(30);
  },
});
