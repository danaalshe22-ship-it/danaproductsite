# L'Occitane Almond Supple Skin Oil landing page

Mobile-first, bilingual (English / Arabic) editorial product landing page for the UAE market. `index.html` contains the page, inline CSS, translations, interaction logic and the single `PRODUCT_FACTS` object. Product claims, review figures, price display, INCI, cross-sell links and services are centralized there. `verifiedOn` records the source review date. Set `showPrice` to `false` when the dated sale price is no longer current; the page then displays a current-price prompt.

## Local development and deployment

Serve the project root as a Vercel project with the `/api/inquiry` serverless function. For local Vercel development, put `PABBLY_WEBHOOK_URL` in the ignored `.env.local` file. Configure the same variable in both **Preview** and **Production** environment variables in Vercel, then redeploy each environment. The browser form POSTs to `/api/inquiry`; the server validates the fields and POSTs a seven-column JSON row to the Pabbly listener. The listener accepting that POST does not prove a spreadsheet row was written.

In Pabbly Connect, capture a sample webhook request, then add a Google Sheets **Add Row** action for the sheet with these headers: `Timestamp`, `Name`, `Email`, `Phone`, `Interest`, `Consent`, `Status`. Map each matching webhook field to its column and enable the workflow. If using Excel instead, use an **Add Row** action for the destination table with those same column headers. Check the Pabbly task history and destination sheet/table to confirm downstream rows are arriving.

## Configuration placeholders

- GA4 Measurement ID: `G-B8HB6B5DHZ` is configured directly in `index.html`. The `gtag.js` library loads only after the visitor opts in for that visit. The earlier GTM container ID is not loaded, avoiding duplicate page views and events.
- `[CAMPAIGN_WHATSAPP_NUMBER]`: replace with the campaign's WhatsApp number in international digits only. Do not use L'Occitane's number.
- `[CAMPAIGN_HANDLE]`: replace with the campaign Instagram handle, without `@`.
- `[AR_STORE_URL]`: optional Arabic UAE product URL. No Arabic route was verified; the page currently uses the English URL.
- `PABBLY_WEBHOOK_URL`: configure as a secret in Vercel Preview and Production.

The page carries an academic-project disclosure for ENT4113. Remove or update it if the project's status changes.

## Product verification notes

The UAE product page was reopened on 20 November 2026. `PRODUCT_FACTS.verifiedOn` is `2026-11-20`. The live page showed 184 AED reduced from 230 AED and an enabled “Add to bag” control for the 100 ml size. This is a temporary price and availability can change; confirm before launch. Reviews showed 5/5, 85 reviews and 100% recommended. Distribution supplied for the graphic: 81 five-star, 4 four-star, zero at 1–3 stars.

Recheck price, offer and stock immediately before publication. The brand marketing copy mentions camelina oil, but the visible INCI does not list it; the page omits camelina claims pending confirmation. L'Occitane states “formulated with 50% almond oil,” while sweet almond oil appears ninth in the supplied INCI; the page omits that percentage claim pending confirmation. Confirm image usage rights for public deployment. The supplied stretch-mark image and the 50% claim graphic are intentionally excluded.

## Image assets

Responsive local WebP derivatives in `images/` are based on the supplied 880 × 1110 bottle, close-up and range images. No 1200 px source was supplied, so the page uses 480 px and native 880 px variants without upscaling. No remote image hotlinks are used.

## Inquiry and privacy

The inquiry form collects name, email, optional phone, interest / product question, and a separate unchecked marketing-consent choice. The server forwards exactly these sheet fields: `Timestamp` (server-generated ISO timestamp), `Name`, `Email`, `Phone` (empty when omitted), `Interest` (the product question), `Consent` (`Yes` or `No` for marketing), and `Status` (`New`). Form values are never sent to analytics. The endpoint validates and bounds fields, handles a honeypot, applies basic in-memory rate limiting, and forwards submissions to Pabbly using the server-side environment variable. It does not log personal data. In-memory limits are best-effort on serverless instances. A successful webhook response only confirms Pabbly accepted the request; verify the downstream row in your spreadsheet.

Google Analytics 4 does not load unless the visitor explicitly opts in. The choice is not persisted. The page privacy notice describes optional analytics and inquiry handling.
