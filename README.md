# Aurelia Private Estates — Enterprise Portfolio & Sovereign Digital Escrow Platform

**Aurelia Private Estates** is a production-grade ultra-prime architectural brokerage platform and multi-portal digital escrow syndicate system built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

## Enterprise Platform Architecture

The application unifies six synchronized operational portals under a single executive interface:

1. **Private Collection**: Full-bleed architectural welcome showcase with exterior/interior switching, direct tour booking dispatch, syndicate performance telemetry, curated dual-angle estate cards, and an interactive family-office mortgage and 5-year yield calculator.
2. **Property Portfolio & Acquisition Desk**: Multi-dimensional filtering by enclave (Malibu, Beverly Hills, Manhattan, Aspen), valuation band, availability status, and architect search, paired with a private aviation/chauffeur tour charter and formal Letter of Intent (LOI) generator issuing unique `APE-XXXX` Portfolio Reference IDs.
3. **3D Floorplan & Bespoke Finish Studio**: Full-width exterior and interior photography gallery with an interactive full-screen lightbox viewer, LiDAR-calibrated interactive SVG floorplan canvas (3D axonometric and 2D CAD modes), room-level acoustic/solar telemetry, and dynamic finish upgrade configuration synced to active escrow dossiers.
4. **Client Escrow & Closing Tracker Portal**: Real-time `APE-XXXX` dossier lookup, a 6-stage closing pipeline tracker, assigned Managing Partner credentials, digital document vault with live countersignature support, and direct client-to-broker messaging.
5. **Private Concierge Mail**: Secure aviation FBO logistics, legal trust, and private viewing dispatch routing directly into the Managing Broker inbox.
6. **Managing Broker Admin ERP**: Five real-time operational modules—Escrow & Offers Pipeline, Estate Inventory Manager, Private Viewings Calendar, Private Brokers Roster, and Client Escrow Inbox—with bidirectional state synchronization across the entire platform.

## Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Engine**: Vite 8
- **Styling**: Tailwind CSS v4 + PostCSS + Autoprefixer
- **Iconography & Motion**: Lucide React + Motion

## Local Development

```bash
npm install
npm run dev
```

## Production Build & Vercel Deployment

```bash
npm run lint
npm run build
```

This repository is pre-configured for zero-intervention deployment on Vercel:
- `.npmrc` pins `legacy-peer-deps=true` for clean dependency resolution.
- `vercel.json` enforces SPA client-side route rewrites to `/index.html`.
- `public/assets/...` and `public/favicon.svg` resolve via root-relative `/assets/...` and `/favicon.svg` production paths.
