# Earme Admin Dashboard (Vue 3 + Vite)

Dashboard web buat mengelola semua konten Earme: kategori, kosakata (+ upload video),
materi SIBI/BISINDO, bank soal kuis, dan artikel. Nyambung ke **Earme Backend (Laravel API)**
pakai token auth (Sanctum).

Sudah aku coba `npm install && npm run build` di sini dan **berhasil tanpa error**, jadi filenya siap pakai.

## 1. Setup

```bash
cd earme-admin
npm install
cp .env.example .env
```

Edit `.env` sesuai alamat backend Laravel kamu:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_STORAGE_BASE_URL=http://localhost:8000
```

Jalankan backend Laravel-nya dulu (`php artisan serve`), baru:

```bash
npm run dev
```

Buka `http://localhost:5173`, login pakai akun seeder: `admin@earme.test` / `password`.

> **Penting:** backend Laravel-nya perlu diizinkan menerima request dari `http://localhost:5173`.
> Ini sudah di-setting di `config/cors.php` pada paket backend sebelumnya — kalau port dev
> server kamu beda, tambahkan portnya di situ juga.

## 2. Build untuk produksi

```bash
npm run build
```
Hasilnya ada di folder `dist/` — tinggal di-deploy ke hosting static apa saja (Netlify, Vercel, atau folder `public` di server yang sama dengan Laravel).

## 3. Fitur

- **Login** — pakai Sanctum token, disimpan di localStorage
- **Dashboard** — ringkasan jumlah kategori, kosakata, materi, soal kuis, artikel
- **Kategori** — CRUD, section Direktori/Kategori
- **Kosakata** — CRUD dengan upload video (wajib) + thumbnail (opsional), filter per kategori
- **Materi** — CRUD dengan upload gambar
- **Kuis** — CRUD soal + 4 pilihan jawaban (radio buat nentuin yang benar)
- **Artikel** — CRUD dengan upload gambar + tanggal terbit

## 4. Desain

Pakai palet warna yang sama dengan app Flutter (teal + clay/coral) supaya dashboard ini
kerasa satu produk sama app mobile-nya, bukan template admin generik. Font: Poppins buat
judul, Inter buat isi (di-load dari Google Fonts di `index.html`).

## 5. Struktur folder

```
src/
  lib/           # axios instance, storage URL helper
  stores/        # Pinia: auth, toast notification
  router/        # routes + auth guard
  layouts/       # AdminLayout (sidebar + topbar)
  components/    # BaseModal, ConfirmDialog, ToastStack, EmptyState, LoadingState, PageHeader
  views/
    LoginView.vue
    DashboardView.vue
    categories/
    entries/
    materials/
    quiz/
    articles/
```

## 6. Yang belum ada

- Manajemen user admin lain (create/edit admin baru) — saat ini cuma 1 admin dari seeder
- Pagination di tabel kosakata (saat ini ambil sampai 200 item sekaligus — cukup untuk skala kamus ini, tapi kalau datanya jadi ribuan, tambahkan pagination)
