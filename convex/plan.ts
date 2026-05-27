import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns the inputs needed to compute today's adaptive plan on the client.
 *
 * The actual exercise selection runs in the frontend via
 * `selectExercisesForToday()` from `src/constants/exerciseLibrary.js`, since
 * the EXERCISE_LIBRARY data lives in the frontend bundle. This query just
 * bundles the three pieces of state the helper needs (profile + recent
 * check-ins + recent sessions) into a single round-trip.
 */
export const getPlanInputs = query({
  args: { installId: v.string() },
  handler: async (ctx, { installId }) => {
    const profile = await ctx.db
      .query("users")
      .withIndex("by_installId", (q) => q.eq("installId", installId))
      .unique();

    const checkIns = await ctx.db
      .query("checkIns")
      .withIndex("by_installId", (q) => q.eq("installId", installId))
      .order("desc")
      .take(14);

    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_installId", (q) => q.eq("installId", installId))
      .order("desc")
      .take(14);

    return { profile, checkIns, sessions };
  },
});
