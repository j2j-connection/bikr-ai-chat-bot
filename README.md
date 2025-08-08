# BIKR AI Chat Bot

AI-powered bicycle diagnostics for bike shops, with Lightspeed Retail (X-Series) integration.

## Features
- Chat-based bike diagnostics with concise, professional outputs
- Lightspeed OAuth connection (Retail X-Series)
- Customer lookup by email/phone; service history context
- Inventory lookup (items/categories); service items listing
- Optional quote/estimate creation (feature-flagged)
- Website embed (floating chat bubble) for shop sites

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:5173
```
Build for production:
```bash
npm run build
```

## Docs
- Onboarding (internal): `LIGHTSPEED_ONBOARDING.md`
- Customer onboarding: `CUSTOMER_ONBOARDING.md`
- Setup quickstart: `LIGHTSPEED_SETUP.md`

## Website Embed (Floating Bubble)
See the "Website Integration" section in `CUSTOMER_ONBOARDING.md` for the copy‑paste snippet.

## Environment
Create `.env.local`:
```
VITE_LIGHTSPEED_CLIENT_ID=...
VITE_LIGHTSPEED_CLIENT_SECRET=...
VITE_LIGHTSPEED_CALLBACK_URL=http://localhost:5173/lightspeed/callback
```

## Security
- OAuth tokens stored client-side with auto-refresh
- No sensitive customer data stored by the app; all requests via HTTPS

