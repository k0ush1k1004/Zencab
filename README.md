# ZenCab

A modern ride-hailing demo built with React + TypeScript + Vite. It showcases a complete booking flow on top of Google Maps, authentication with Clerk, Tailwind styling, and delightful motion.


## Features
- Auth & landing
  - Polished landing page with Framer Motion animations
  - Sign in / Sign up via Clerk (modals on the landing page)
- Book a ride (Home)
  - Google Places Autocomplete for pickup and drop-off
  - Map with draggable markers and live route polyline
  - Use current GPS location
- Choose options (RideOptions)
  - Vehicle types (Bike, Auto, Mini, Sedan, SUV)
  - Dynamic fare calculation, surge, and promo codes (ZENCAB10, FIRST20)
  - ETA, capacity, and eco/CO₂ impact badges
- Track ride (RideTracking)
  - Animated vehicle moving along route with bearing/rotation
  - Progress bar, ETA, driver card
- Complete ride (RideComplete)
  - Receipt modal, tipping, rating, share
  - Confetti celebration
- Profile
  - User details from Clerk and recent trips list


## Tech stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Clerk for authentication (`@clerk/clerk-react`)
- Google Maps via `@react-google-maps/api`
- Framer Motion for animations
- Icons: `lucide-react`

Optional/utility:
- `src/utils/loadMappls.ts` contains a helper to load Mappls SDK (not used by default)


## Prerequisites
- Node.js 18+ and npm
- Clerk account and a Publishable Key
- Google Maps APIs:
  - Enable: Maps JavaScript API, Places API, Directions API


## Environment variables
Create a `.env` (or `.env.local`) in the project root:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxxx
```

Notes:
- Keys must be prefixed with VITE_ to be exposed to the client.
- In Clerk dashboard, allow localhost origins for development.


## Install & run
```
npm install
npm run dev
```
- App runs on: http://localhost:5173

Additional scripts:
- `npm run build` – production build
- `npm run preview` – preview built app
- `npm run lint` – lint with ESLint
- `npm run typecheck` – TS project check


## Project structure (key files)
```
src/
  App.tsx                # App shell and page flow controller
  main.tsx               # App entry with ClerkProvider
  index.css              # Tailwind entry
  components/
    LandingPage.tsx      # Animated landing + Clerk modals
    Home.tsx             # Search, map, confirm ride
    RideOptions.tsx      # Vehicle cards, fare, promos, carbon info
    RideTracking.tsx     # Animated route/vehicle + progress
    RideComplete.tsx     # Receipt, rating, tip, share
    Profile.tsx          # User profile and trips
  utils/
    loadMappls.ts        # Optional Mappls loader
public/
  zencab-background.png
```


## Configuration and CSP
`index.html` includes a Content-Security-Policy tuned for:
- Google Maps (maps.googleapis.com, maps.gstatic.com)
- Clerk (accounts.dev)
- Images, workers, and inline styles used by Tailwind/Clerk

If deploying, update CSP and allowed domains in Clerk to match your host.


## Deployment
- Build with `npm run build`; deploy the `dist/` folder to any static host (Vercel, Netlify, etc.)
- Provide the same environment variables on your host
- Adjust CSP and Clerk allowed origins for your production domain


## Optional example app
The `clerk-react/` folder contains a minimal Vite + React + Clerk example. The main ZenCab app lives at the repository root.


## Notes
- This app is a demo. Do not expose secret keys in the client.
- Supabase, Three.js, and other deps may be present for experimentation but are not required to run the core flow.

