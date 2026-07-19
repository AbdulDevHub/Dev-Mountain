---
id: web-monetization
title: Web Monetization
sidebar_label: Web Monetization
tags: [monetization, ads, saas, stripe, payments, subscriptions]
description: Notes on how to make money from a website — advertising, SaaS/subscriptions, payment integration (Stripe), and other models.
---

A living reference for the different ways to make money from a website or web app, how each one actually gets implemented, and the tradeoffs between them. The goal is a menu of options plus enough implementation detail to get moving without re-researching from scratch every time.

:::tip TL;DR
There are basically four buckets: **ads** (someone else pays you to show their stuff), **subscriptions/SaaS** (people pay recurring for access to a product), **one-time payments** (people pay once for a thing), and **affiliate/referral** (you get a cut for sending someone else a customer). Most successful sites combine two or three of these rather than relying on one.
:::

---

## 1. Advertising

Ads are the lowest-effort way to monetize traffic, but they need real volume (tens of thousands of monthly visitors, minimum) before the revenue is meaningful. Good for content sites, blogs, tools with high traffic and low direct purchase intent.

### Ad networks worth knowing

| Network | Traffic needed | Notes |
|---|---|---|
| **Google AdSense** | Low (just needs approval) | Easiest to start with, lowest payout per impression. Good default for a new site. |
| **Ezoic** | ~10k sessions/mo | AI-optimized ad placement, better payouts than raw AdSense, free tier. |
| **Mediavine** | 50k sessions/mo | Strong payouts, but strict traffic + niche requirements. |
| **AdThrive / Raptive** | 100k pageviews/mo | Top-tier payouts, invite/application only. |
| **Carbon Ads** | Any (curated) | Great fit for dev/design/tech blogs — non-intrusive, single clean ad unit. |
| **Direct/sponsorship ads** | Any | Sell your own ad slot directly to a sponsor (e.g. a "sponsored by" banner). Best $/impression by far if you can land deals. |

### Implementation notes

- AdSense is just a `<script>` tag + `<ins>` ad-unit elements. The script loads once per page; each ad slot is then just an `<ins>` element that AdSense fills in.
- **Ad blockers** will kill 20–40% of your ad revenue depending on audience (dev audiences block much more). Don't rely on ads as your only channel if your audience is technical.
- **Core Web Vitals**: badly implemented ads (layout shift, blocking scripts) will tank your SEO ranking, which then tanks your traffic, which then tanks your ad revenue. Always reserve space for ad slots (fixed `min-height`) to avoid CLS penalties.
- **Ad density vs UX**: more ads ≠ more revenue past a point — bounce rate rises and average session value can fall. Rule of thumb: never more than one ad per ~600px of content on mobile.

### Example: plain HTML / static site

Load the AdSense library once in `<head>`, then drop an `<ins>` block anywhere you want an ad to render. Reserve space with `min-height` so the layout doesn't jump (CLS).

```html
<!-- In <head>, once per page -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>

<!-- Anywhere in <body> where you want an ad slot -->
<ins
  class="adsbygoogle"
  style="display:block; min-height:250px;"
  data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
  data-ad-slot="1234567890"
  data-ad-format="auto"
  data-full-width-responsive="true"
></ins>
<script>
  (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

Each `<ins>` + `push({})` pair renders one ad unit. Repeat the `<ins>`/`push` block (not the `<script src>` tag — that only loads once) wherever you want another slot on the same page.

### Example: React / Vite

In React, wrap the ad slot in a small reusable component. The library script is loaded once (e.g. in `index.html` or via a `useEffect` in your root component), and each `<AdUnit>` instance just calls `push({})` when it mounts.

```html
<!-- index.html, in <head> -->
<script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"
></script>
```

```jsx
// components/AdUnit.jsx
import { useEffect, useRef } from "react";

export default function AdUnit({ slot, format = "auto", style }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Guard against double-push in React 18 StrictMode / re-renders
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, []);

  return (
    <ins
      ref={insRef}
      className="adsbygoogle"
      style={{ display: "block", minHeight: 250, ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
```

```jsx
// Usage anywhere in the app
<AdUnit slot="1234567890" />
```

Note: with client-side routing (React Router etc.), each new "page" the user navigates to needs its ad slots re-pushed — the `useEffect` above handles this automatically since it re-runs on mount for each new `<AdUnit>` instance.

### Example: Next.js

Use `next/script` with the `afterInteractive` strategy so the AdSense library doesn't block initial page render, and build the same kind of reusable `<AdUnit>` client component.

```jsx
// app/layout.jsx (App Router)
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

```jsx
// components/AdUnit.jsx
"use client";
import { useEffect } from "react";

export default function AdUnit({ slot, format = "auto", style }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", minHeight: 250, ...style }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
```

Same idea for Pages Router — just put the `<Script>` tag in `pages/_app.jsx` instead of `app/layout.jsx`. In both cases `<AdUnit>` must be a **client component** (`"use client"`) since it touches `window`.

### Example: loading AdSense site-wide in Docusaurus

Add the AdSense loader script globally via `docusaurus.config.js` `headTags` (runs on every page, so it only needs to be declared once):

```js
// docusaurus.config.js
module.exports = {
  // ...
  headTags: [
    {
      tagName: "script",
      attributes: {
        async: "true",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX",
        crossorigin: "anonymous",
      },
    },
  ],
};
```

### Example: a reusable, CLS-safe ad-slot component

A wrapped component keeps every ad unit consistent and reserves layout space up front, so the ad loading in doesn't cause content to jump around (the #1 way ads hurt Core Web Vitals / SEO).

```jsx
// src/components/AdSlot.jsx
import { useEffect, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

function AdSlotInner({ slotId, minHeight = 280 }) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      // (window.adsbygoogle = window.adsbygoogle || []).push({}) is the
      // standard AdSense call — it fills whichever <ins> tags are on the page.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, []);

  return (
    <div style={{ minHeight, margin: "24px 0" }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Ads only make sense client-side (no SSR), so wrap in BrowserOnly —
// this also keeps Docusaurus's static build from choking on `window`.
export default function AdSlot(props) {
  return <BrowserOnly>{() => <AdSlotInner {...props} />}</BrowserOnly>;
}
```

Usage inside an MDX doc or a custom React page:

```mdx
import AdSlot from "@site/src/components/AdSlot";

Some article content here...

<AdSlot slotId="1234567890" />

More content continues after the ad, with no layout shift because
`minHeight` already reserved the space before the ad script loaded.
```

### Example: Carbon Ads (simpler, no reserved-space juggling needed)

Carbon Ads serves a single fixed-size unit, so it's a one-line async script drop-in — good fit for a docs/dev-blog site like this one:

```html
<script
  async
  src="//cdn.carbonads.com/carbon.js?serve=CXXXXXXX&placement=yoursitecom"
  id="_carbonads_js"
></script>
```

Drop that directly into an MDX file or a `<Head>` block wherever you want the ad to render (e.g. a sidebar or end-of-post slot).

### Alternatives to traditional ads

- **Newsletter sponsorships** — if you have an email list, sponsors will pay per-send even at small list sizes (1,000+ subscribers).
- **Affiliate links** (see below) often out-earn display ads per visitor once you have topical trust.

---

## 2. Affiliate & referral revenue

You recommend a product/service, you get a cut of the sale or a flat referral fee. Works especially well for review sites, comparison tools, and "best X for Y" content.

- **Amazon Associates** — low commission (1–10%) but near-universal product coverage, easy approval.
- **SaaS affiliate programs** (Notion, ConvertKit, Bubble, hosting providers like Vercel/DigitalOcean) — often 20–30% recurring commission, much better $/click for niche tech content.
- **Impact / PartnerStack / Rewardful** — platforms that host affiliate programs for many SaaS companies; one dashboard instead of dozens of separate signups.

Implementation is just a tracked link (`?ref=yourhandle` or a redirect through the affiliate platform's URL) — no backend needed. Disclose affiliate relationships; it's an FTC requirement in the US and good practice everywhere.

---

## 3. SaaS & Subscriptions

The highest-ceiling model: recurring revenue, compounding growth, and (if you get retention right) very defensible economics. Also the most work — you're building and maintaining a product, not just placing a script tag.

### Picking a SaaS idea

The best SaaS ideas solve a **narrow, painful, recurring** problem for a **specific** audience who already spends money on tools. "Build something for everyone" is a trap — niche down.

A prompt structure that works well when brainstorming with an AI model (Claude, etc.):

```text
I want to find a SaaS idea. Help me brainstorm using this filter:
1. The problem must be recurring (weekly+), not a one-time task.
2. The audience must already pay for software (freelancers, agencies,
   small business owners — not "everyone" or "students").
3. I should be able to build a v1 in under 4 weeks solo.
4. There should be an obvious first 100 customers I could reach directly
   (a subreddit, a Discord, a niche forum, a LinkedIn audience).

Give me 10 ideas across different niches, each with: the pain point,
who feels it, how they solve it today (the real competitor is usually
"a spreadsheet" or "doing it manually"), and a rough pricing model.
```

Good niches to point an AI brainstorm at (evergreen, underserved by big players):

- **Vertical tools for a specific trade** (e.g. scheduling for art studios, quoting software for landscapers) — less competition than horizontal tools, high willingness to pay.
- **"Glue" tools** that connect two things people already use but that don't talk to each other well (e.g. syncing data between two niche platforms).
- **Compliance / reporting** for a specific regulated industry — painful, recurring, budget already exists.
- **Internal-tool-as-a-product** — something you built for your own job/side project that turns out other people in that role need too.
- **AI-wrapper tools with a real workflow around them** — not just "ChatGPT with a UI," but AI embedded into a specific repeatable task (e.g. auto-drafting a specific document type from structured inputs).

### Pricing models

| Model | When to use it |
|---|---|
| **Flat monthly/annual** | Simple, predictable. Good default for early-stage SaaS. |
| **Usage-based** | Good when cost-to-serve scales with usage (API products, AI tools with inference cost). |
| **Seat-based** | Good for team tools where value scales with number of users. |
| **Freemium** | Good for viral/network-effect products; free tier is the acquisition channel. Riskier — most free users never convert (1–5% is typical). |
| **Tiered (Good/Better/Best)** | Classic SaaS default — anchors people toward the middle tier. |

Annual plans (discounted ~15–20% vs monthly) meaningfully improve cash flow and reduce churn — worth offering from day one even pre-launch.

### Docusaurus/React implementation notes

If the SaaS front-end lives in a React app (not Docusaurus itself, which is really a docs/marketing site), the marketing site (Docusaurus) and the actual app are usually **separate deployments**:

- `docs.yoursite.com` or `yoursite.com` → Docusaurus marketing/docs site
- `app.yoursite.com` → the actual product (separate React/Next.js app + backend)

Use Docusaurus for the landing page, docs, and blog; link out to the app subdomain for signup/login. Trying to cram a full SaaS app into Docusaurus itself fights the framework.

---

## 4. Payment integration (Stripe)

Stripe is the default choice unless there's a specific reason not to use it (e.g. platforms/marketplaces might want Stripe Connect specifically; some regions do better with a local processor like Paddle or Lemon Squeezy).

### Stripe vs "Merchant of Record" alternatives

| | Stripe | Paddle / Lemon Squeezy |
|---|---|---|
| Sales tax / VAT | **You're responsible** (use Stripe Tax add-on) | **They're the Merchant of Record** — they handle global tax/VAT for you |
| Fees | ~2.9% + $0.30 | ~5% (higher, but includes tax handling) |
| Best for | Teams who want full control, or already have tax handling sorted | Solo devs / small teams who don't want to deal with global VAT compliance |

For a solo indie SaaS, **Lemon Squeezy or Paddle can save weeks of tax-compliance headache**. For anything with more custom billing logic (usage-based, complex plans, marketplaces), Stripe is more flexible.

### Core Stripe building blocks

- **Stripe Checkout** — hosted payment page, fastest to implement, least custom code. Good default for v1.
- **Stripe Elements** — embeddable payment form components if you want the payment UI inside your own app instead of redirecting.
- **Stripe Billing** — subscriptions, proration, invoicing, dunning (failed payment retries) — this is what actually makes SaaS billing work, not just one-off Checkout sessions.
- **Stripe Customer Portal** — a pre-built page where customers can update their card, cancel, or change plans without you building that UI yourself. Turn this on — it saves enormous amounts of support time.
- **Webhooks** — Stripe notifies your backend on events (`checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, etc.). This is how you actually grant/revoke access — **never** gate access purely on the client-side redirect after checkout, always confirm via webhook.

### Minimal subscription flow (conceptual)

1. User clicks "Subscribe" → your backend creates a Stripe Checkout Session (`mode: 'subscription'`) with a `price_id` for the plan.
2. User is redirected to Stripe-hosted checkout, pays.
3. Stripe redirects back to a `success_url` on your site — **this is UX only, not proof of payment**.
4. Stripe sends a `checkout.session.completed` webhook to your backend → this is where you actually mark the user as subscribed in your database.
5. Ongoing: `invoice.paid` keeps access alive each billing cycle; `invoice.payment_failed` triggers dunning emails; `customer.subscription.deleted` revokes access on cancellation.

```js
// Example: creating a Checkout Session (Node/Express-style backend)
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: "price_XXXXXXXX", quantity: 1 }],
  success_url: "https://app.yoursite.com/welcome?session_id={CHECKOUT_SESSION_ID}",
  cancel_url: "https://yoursite.com/pricing",
  customer_email: user.email,
});
```

```js
// Example: verifying a webhook (always verify the signature!)
const event = stripe.webhooks.constructEvent(
  req.rawBody,
  req.headers["stripe-signature"],
  process.env.STRIPE_WEBHOOK_SECRET
);

if (event.type === "checkout.session.completed") {
  // mark user as paid in your DB
}
```

### Things that bite people later

- **Always verify webhook signatures** — otherwise anyone can POST a fake "payment succeeded" event to your endpoint.
- **Idempotency** — webhooks can be delivered more than once; design your handler so processing the same event twice is harmless.
- **Test mode vs live mode** use completely separate API keys and data — easy to accidentally build against test keys in "production."
- **Proration** on plan upgrades/downgrades is handled by Stripe Billing automatically, but decide up front whether you want immediate proration or "apply at next cycle."
- **Local currency / regional payment methods** (iDEAL, SEPA, etc.) can meaningfully increase conversion in non-US markets — Stripe Checkout can auto-enable these.

---

## 5. One-time purchases / digital products

Simpler than subscriptions — sell a template, ebook, plugin, license key, or lifetime-deal version of a tool.

- **Gumroad / Lemon Squeezy** — fastest way to sell a digital product with zero backend work (hosted checkout, file delivery, VAT handled).
- **Stripe Checkout in `mode: 'payment'`** — if you want it fully custom/embedded in your own site.
- **License keys** for software/plugins — generate a key on successful payment (via webhook), email it, and validate it in the product itself.

Good complement to a SaaS: a "lifetime deal" tier can fund early development, though it trades away long-term recurring revenue — use sparingly (e.g. capped to first N customers).

---

## 6. Choosing a model for a given site

Quick decision guide:

- **High-traffic content/blog, low purchase intent** → ads + affiliate links.
- **Tool that solves a recurring problem for a specific professional audience** → SaaS subscription.
- **One clear valuable asset (template, course, plugin)** → one-time purchase.
- **Have an audience but no product yet** → start with affiliate + a newsletter, validate demand, then build the paid product once you know what people actually want.

Most durable sites end up layering these: e.g. a SaaS product with a content/docs site (Docusaurus!) that also runs a few tasteful affiliate links and maybe a sponsor slot in a changelog/newsletter.

---

## 7. Legal & practical checklist

- [ ] **Terms of Service** and **Privacy Policy** pages — required before processing payments or running ads (ad networks like AdSense require this).
- [ ] **Cookie consent banner** if using ads/analytics in regions covered by GDPR/ePrivacy (EU) or similar (many US states now too).
- [ ] **Sales tax / VAT** — decide Stripe Tax vs a Merchant-of-Record provider *before* launch; retrofitting tax handling later is painful.
- [ ] **Refund policy** stated clearly — chargebacks are more expensive than refunds (fees + account risk), so make refunds easy.
- [ ] **Business entity** — at minimum consider whether you need an LLC or equivalent before real revenue starts flowing, for liability separation.
- [ ] **Affiliate disclosures** on any page with affiliate links (FTC requirement in the US).

---

## Further reading / references

- [Stripe Docs](https://docs.stripe.com)
- [Stripe Billing docs](https://docs.stripe.com/billing)
- [Google AdSense Help](https://support.google.com/adsense)
- [Paddle vs Stripe comparison (Paddle's own, read critically)](https://www.paddle.com)
- [Indie Hackers](https://www.indiehackers.com) — real revenue numbers and post-mortems from small SaaS/side-project founders
