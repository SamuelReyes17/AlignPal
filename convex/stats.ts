import { query } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardStats = query({
  args: { installId: v.string() },
  handler: async (ctx, args) => {
    const recentSessions = await ctx.db
      .query("sessions")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .order("desc")
      .take(30);

    const recentCheckIns = await ctx.db
      .query("checkIns")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .order("desc")
      .take(30);

    const completedSessions = recentSessions.filter((s) => s.completed);
    const totalDurationMinutes = completedSessions.reduce(
      (sum, s) => sum + s.durationMinutes,
      0
    );
    const avgPainLevel =
      recentCheckIns.length > 0
        ? recentCheckIns.reduce((sum, c) => sum + c.painLevel, 0) /
          recentCheckIns.length
        : null;

    return {
      sessionCount: completedSessions.length,
      totalDurationMinutes,
      avgPainLevel,
      latestPainLevel: recentCheckIns[0]?.painLevel ?? null,
    };
  },
});
