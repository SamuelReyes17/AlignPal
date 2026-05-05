import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Called when the user completes onboarding — creates or updates their profile.
export const upsertProfile = mutation({
  args: {
    installId: v.string(),
    painLocations: v.array(v.string()),
    painIntensity: v.number(),
    painTypes: v.array(v.string()),
    painDescription: v.optional(v.string()),
    worstTimeTriggers: v.array(v.string()),
    sittingHours: v.optional(v.string()),
    trainingFrequency: v.optional(v.string()),
    ageRange: v.optional(v.string()),
    email: v.optional(v.string()),
    painDuration: v.optional(v.string()),
    directionalPreference: v.optional(v.string()),
    radiatingPain: v.optional(v.array(v.string())),
    redFlags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { installId, ...profile } = args;
    const existing = await ctx.db
      .query("users")
      .withIndex("by_installId", (q) => q.eq("installId", installId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { ...profile, onboardingComplete: true });
      return existing._id;
    }

    return await ctx.db.insert("users", {
      installId,
      ...profile,
      onboardingComplete: true,
      isPremium: false,
    });
  },
});

export const getProfile = query({
  args: { installId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .unique();
  },
});

// Called by the RevenueCat webhook — never by clients directly.
export const setPremiumStatus = internalMutation({
  args: {
    installId: v.string(),
    isPremium: v.boolean(),
    rcCustomerId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_installId", (q) => q.eq("installId", args.installId))
      .unique();

    if (!user) return;

    await ctx.db.patch(user._id, {
      isPremium: args.isPremium,
      ...(args.rcCustomerId !== undefined ? { rcCustomerId: args.rcCustomerId } : {}),
    });
  },
});
