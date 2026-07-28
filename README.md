<div align="center">

# ✋ Earme Admin Dashboard

**Content management dashboard for Earme — a Sign Language Dictionary Platform**

![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/State-Pinia-FFD859)
![Axios](https://img.shields.io/badge/HTTP-Axios-5A29E4)
![License](https://img.shields.io/badge/license-MIT-blue)

[Backend API →](https://github.com/wiwinwidiaaan/earme-backend) · [Mobile App →](https://github.com/wiwinwidiaaan/earme-flutter)

</div>

---

## About

A web dashboard for managing all of Earme's content — vocabulary entries, gesture
videos, learning material, quiz questions, and articles — backed by the
[Earme Laravel API](https://github.com/wiwinwidiaaan/earme-backend). Built as the
admin-facing counterpart to the Earme mobile app.

<!--
  📸 Add screenshots of the dashboard once you have them, e.g.:
  ![Dashboard screenshot](docs/screenshot-dashboard.png)
  ![Category CRUD screenshot](docs/screenshot-categories.png)
-->

## Features

- 🔐 Token-based login (Laravel Sanctum)
- 📊 Dashboard overview with live content counts
- ▤ Full CRUD for **categories** (Direktori / Kategori sections)
- ✋ Full CRUD for **vocabulary entries**, including video + thumbnail upload
- ▥ Full CRUD for **learning material** (SIBI/BISINDO) with image upload
- ？ Full CRUD for **quiz questions**, with a radio-button UI for marking the correct answer
- ▦ Full CRUD for **articles**, with cover image and publish date
- 🔔 Toast notifications, confirm-before-delete dialogs, loading/empty states throughout

## Tech stack

| Layer      | Technology                                            |
| ---------- | ----------------------------------------------------- |
| Framework  | Vue 3 (Composition API, `<script setup>`)             |
| Build tool | Vite                                                  |
| Routing    | Vue Router 4                                          |
| State      | Pinia                                                 |
| HTTP       | Axios                                                 |
| Styling    | Hand-written CSS with design tokens (no UI framework) |

## Design

Shares a color palette (deep teal + clay/coral) and typography (Poppins + Inter) with
the Flutter mobile app, so the dashboard reads as part of the same product rather than a
generic admin template bolted on afterward.

## Getting started

> Requirements: Node.js ≥ 18, the [Earme backend](https://github.com/wiwinwidiaaan/earme-backend) running locally or deployed

```bash
npm install
cp .env.example .env
```

Point `.env` at your backend:

```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STORAGE_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

Log in with the seeded admin account from the backend: `admin@earme.test` / `password`.

## Build for production

```bash
npm run build
```

Outputs a static `dist/` folder, deployable to any static host (Netlify, Vercel, or
served from the same box as the Laravel backend).

## Project structure

```
src/
  lib/           # axios instance, storage URL helper
  stores/        # Pinia: auth, toast notifications
  router/        # routes + auth guard
  layouts/       # AdminLayout (sidebar + topbar)
  components/    # BaseModal, ConfirmDialog, ToastStack, EmptyState, LoadingState, PageHeader
  views/
    LoginView.vue
    DashboardView.vue
    categories/ · entries/ · materials/ · quiz/ · articles/
```

## Related repos

- 🔧 [earme-backend](https://github.com/wiwinwidiaaan/earme-backend) — Laravel REST API
- 📱 [earme-flutter](https://github.com/wiwinwidiaaan/earme-flutter) — mobile dictionary app

## License

MIT — feel free to use this as a reference for your own projects.
