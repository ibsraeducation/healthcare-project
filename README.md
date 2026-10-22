# CarePoint — Healthcare Project

A doctor-appointment website converted from the Figma design
[**Healthcare-Project**](https://www.figma.com/design/C0elL1vOJ5yliuEk2MrYcw/Healthcare-Project?node-id=0-1)
into a static, dependency-free build. Screens covered:

- **Onboarding** — 3-slide carousel with skip
- **Auth** — Sign in · Sign up · Forgot password · Reset (OTP code `2468` in this demo)
- **Home** — greeting hero, specialty picker, top doctors, health reads, next-visit card
- **Search** — free-text search, specialty chips, "followed" filter, sort by rating/fee/experience
- **Doctor page** — profile, stats, education, reviews, working hours, sticky *Book*
- **Booking flow** — day picker → time slots (busy ones struck-through) → patient details → review & confirm
- **Confirmation** — success screen
- **Appointments** — upcoming / history, cancel (with dialog), demo clinic chat
- **Profile** — personal info, preferences, local-data wipe
- **About** — what the build covers

Everything runs **fully offline**: no frameworks, no network calls, no fonts or
images fetched. Profile, bookings and followed doctors are kept in
`localStorage` (`hc.v1`); nothing ever leaves the browser.

## Run it locally

```bash
npm run dev        # → http://localhost:5186
```

`npm run dev` starts the tiny zero-dependency server (`server.mjs`, Node ≥ 18).
No `npm install` needed. Alternatives: any static server (`npx serve .`) works
just as well, since the app is plain HTML/CSS/JS with hash routing.

## Structure

```
index.html      app shell
styles.css      design system (tokens, primitives, screens)
app.js          router, screens, interactions
data.js         demo doctors, specialties, reviews, slots
server.mjs      tiny static server (port 5186)
assets/         decorative SVGs
```

## Notes on the conversion

The Figma file is a mobile-shaped app design; the website keeps its flow and
palette (teal `#0B7285` on soft `#F3F8FA`, rounded cards, pill buttons) and
presents it as a responsive site — full-width pages with a top navigation on
desktop, a bottom tab bar on small screens, and device-style frames on the
onboarding/auth screens. Busy slots, ratings and reviews are deterministic
demo data. No seat is ever reserved and no payment is taken — it is a
converted-design demo.

## Deploy

Any static host works as-is (GitHub Pages, Vercel, Netlify). With GitHub
Pages: Settings → Pages → Deploy from branch → `main` / (root). The hash-based
router needs no rewrite rules.
