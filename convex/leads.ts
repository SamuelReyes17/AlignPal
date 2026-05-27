import { mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Called the moment a user submits their email — before onboarding is complete.
export const saveLead = mutation({
  args: {
    installId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { email: args.email });
      return existing._id;
    }

    const id = await ctx.db.insert("leads", {
      installId: args.installId,
      email: args.email,
    });

    // Fire welcome email in the background (no-op until Resend is wired)
    await ctx.scheduler.runAfter(0, internal.email.sendWelcomeEmail, {
      email: args.email,
    });

    return id;
  },
});

// View all leads in the Convex dashboard → Functions tab, or use this
// internally for exports. Never expose this publicly without auth.
export const getAllLeads = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").take(1000);
  },
});
