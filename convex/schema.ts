import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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
    // Clinical signals — drive evidence-based exercise selection
    painDuration: v.optional(v.string()),            // 'acute' | 'subacute' | 'chronic' | 'recurrent'
    directionalPreference: v.optional(v.string()),   // 'flexion' | 'extension' | 'rotation' | 'sustained' | 'unclear'
    radiatingPain: v.optional(v.array(v.string())),  // ['none','glute','above_knee','below_knee','arm','hand','headache']
    redFlags: v.optional(v.array(v.string())),       // ['bowel_bladder','saddle_numb','night_pain', ...]
    onboardingComplete: v.boolean(),
    isPremium: v.boolean(),
    rcCustomerId: v.optional(v.string()),
  }).index("by_installId", ["installId"]),

  // Captures emails as soon as they're entered — even if onboarding is
  // never completed. This is the marketing lead list.
  leads: defineTable({
    installId: v.string(),
    email: v.string(),
  })
    .index("by_installId", ["installId"])
    .index("by_email", ["email"]),

  checkIns: defineTable({
    installId: v.string(),
    date: v.string(),         // "YYYY-MM-DD"
    painLevel: v.number(),    // 1-10
    exercisesDone: v.boolean(),
    notes: v.optional(v.string()),
  })
    .index("by_installId", ["installId"])
    .index("by_installId_and_date", ["installId", "date"]),

  sessions: defineTable({
    installId: v.string(),
    date: v.string(),         // "YYYY-MM-DD"
    exerciseNames: v.array(v.string()),
    durationMinutes: v.number(),
    completed: v.boolean(),
  })
    .index("by_installId", ["installId"])
    .index("by_installId_and_date", ["installId", "date"]),
});
