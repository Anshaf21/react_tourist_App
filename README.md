# Explore Sri Lanka

A React + Vite web app for browsing Sri Lankan attractions — search, filter by category,
favorites, and a stylized map view with distance sorting.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Adding places

Edit the `PLACES` array near the top of `src/ExploreSriLanka.jsx`. Each entry needs:

```js
{
  id: 27,
  name: "Ella Rock",
  district: "Badulla",
  province: "Uva",
  category: "nature", // historical | religious | nature | entertainment | other
  lat: 6.8667,
  lng: 81.0466,
  feeLocal: 0,     // LKR
  feeForeign: 0,   // USD
  rating: 4.4,
  blurb: "A steep hiking trail through tea estates to sweeping valley views.",
}
```

Notes:
- `id` must be unique.
- `category` must match one of the five existing keys exactly.
- `lat`/`lng` should fall roughly within Sri Lanka's bounds (lat 5.9–9.9, lng 79.5–81.9)
  so the pin lands correctly on the stylized map.
