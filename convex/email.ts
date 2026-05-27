"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// ─── To enable Resend ────────────────────────────────────────────────────────
// 1. Sign up at resend.com (free — 3,000 emails/month)
// 2. Get your API key from resend.com/api-keys
// 3. Add it to Convex: npx convex env set RESEND_API_KEY re_xxxxxxxxxxxx
// 4. Verify your sending domain in the Resend dashboard
// 5. Replace the from address below with your verified domain
// 6. Uncomment the Resend block
// ─────────────────────────────────────────────────────────────────────────────

export const sendWelcomeEmail = internalAction({
  args: {
    email: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      // Resend not configured yet — log and return silently
      console.log("[email] Resend not configured. Lead captured:", args.email);
      return;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AlignPal <onboarding@resend.dev>",
        to: args.email,
        subject: "Your personalized recovery plan is ready 💜",
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #07050F; color: #F0EEFF; padding: 40px 32px; border-radius: 16px;">
            <h1 style="font-size: 28px; font-weight: 800; color: #F0EEFF; margin-bottom: 8px;">Your plan is ready.</h1>
            <p style="font-size: 16px; color: #8A7CB8; line-height: 1.6; margin-bottom: 32px;">
              We've built a personalized recovery protocol based on your exact pain profile.
              Open the AlignPal app to start your first session — it takes less than 10 minutes.
            </p>
            <div style="background: #110C24; border: 1px solid #1E1640; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
              <p style="font-size: 14px; color: #8A7CB8; margin: 0 0 6px 0; font-weight: 600;">WHY THIS WORKS</p>
              <p style="font-size: 15px; color: #F0EEFF; line-height: 1.6; margin: 0;">
                Unlike generic stretching routines, AlignPal targets the root cause of your pain —
                not just the symptoms. Consistency for 7–14 days is all it takes to notice a real shift.
              </p>
            </div>
            <p style="font-size: 13px; color: #4A3D72; text-align: center; margin: 0;">
              You're receiving this because you signed up at AlignPal.
              <a href="#" style="color: #7C5CF0;">Unsubscribe</a>
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[email] Resend error:", err);
    }
  },
});
