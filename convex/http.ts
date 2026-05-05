import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// RevenueCat events that mean the user is now premium
const PREMIUM_EVENTS = new Set([
  "INITIAL_PURCHASE",
  "RENEWAL",
  "PRODUCT_CHANGE",
  "UNCANCELLATION",
]);

// RevenueCat events that mean the user's subscription has lapsed
const LAPSED_EVENTS = new Set([
  "CANCELLATION",
  "EXPIRATION",
  "BILLING_ISSUES",
]);

http.route({
  path: "/webhooks/revenuecat",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const body = await req.json() as {
      event?: { type?: string; app_user_id?: string };
    };
    const event = body?.event;

    if (!event?.type || !event?.app_user_id) {
      return new Response("Missing event data", { status: 400 });
    }

    const { type, app_user_id: installId } = event;

    if (PREMIUM_EVENTS.has(type)) {
      await ctx.runMutation(internal.users.setPremiumStatus, {
        installId,
        isPremium: true,
        rcCustomerId: installId,
      });
    } else if (LAPSED_EVENTS.has(type)) {
      await ctx.runMutation(internal.users.setPremiumStatus, {
        installId,
        isPremium: false,
      });
    }

    return new Response("OK", { status: 200 });
  }),
});

export default http;
