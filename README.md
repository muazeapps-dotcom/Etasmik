# Sistem Tasmik Digital - SK Sungai Manila (E-Tasmik Tahap 2)

React app with Tailwind CSS, dark theme, and responsive layout based on the Google Stitch design.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Routes

- `/` — Muka Depan (landing / Log Masuk Guru)
- `/app/utama` — Menu Utama
- `/app/murid` — Pengurusan Murid
- `/app/tasmik` — Borang Rekod Tasmik
- `/app/laporan` — Laporan & Tetapan Admin
- `/app/kenaikan-kelas` — Kenaikan Kelas Pukal
- `/app/arkib` — Arkib Rekod Lama
- `/app/profil` — Profil Guru GPI

## Stack

- React 18 + Vite
- React Router 6
- Tailwind CSS (dark mode, custom emerald/gold theme, Lexend font)
- Material Symbols Outlined (icons)

Theme: `background-dark` (#102219), `primary` (#11d473), emerald and gold accents. Layout is responsive with `max-w-md` for a mobile-first feel.
