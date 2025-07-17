# 🧭 Manago

**Manago** adalah aplikasi web produktivitas untuk **manajemen tugas (task scheduling)** dan **pencatatan pengeluaran (expense tracking)**.  
Dikembangkan oleh [@xisain](https://github.com/xisain), aplikasi ini membantu individu maupun tim dalam mengelola waktu dan keuangan secara efisien.

---

## ✨ Fitur Utama

- ✅ **Manajemen Tugas**
  - Tambah, ubah, filter, dan tandai status tugas
  - Prioritas: Rendah, Sedang, Tinggi
  - Due date dan notifikasi visual

- 💸 **Pelacakan Pengeluaran**
  - Catat pengeluaran dengan kategori
  - Format mata uang IDR
  - Riwayat transaksi dengan filter tanggal

- 📊 **Visualisasi Data**
  - Grafik pie dan line chart menggunakan Recharts
  - Statistik progres tugas dan total pengeluaran

- 👤 **Autentikasi & Multi-User**
  - Setiap user memiliki data pribadi

- 🌗 **Tampilan Modern**
  - UI responsif + Dark mode
  - Komponen siap pakai dari shadcn/ui + TailwindCSS

---

## 🚀 Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/xisain/manago.git
   ```

2. **Masuk ke direktori project**
   ```bash
   cd manago
   ```

3. **Install dependensi backend & frontend**
   ```bash
   composer install
   npm install
   ```

4. **Buat file environment & generate key**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Siapkan database & migrasi**
   ```bash
   php artisan migrate
   ```

6. **Jalankan aplikasi**
   ```bash
   php artisan serve
   npm run dev
   ```

---

## ⚙️ Konfigurasi

Pastikan file `.env` memiliki konfigurasi berikut:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=manago
DB_USERNAME=root
DB_PASSWORD=

APP_URL=http://localhost:8000
```

Jika menggunakan Clerk, atur juga credential API-nya di `.env`.

---

## 📂 Struktur Direktori

```
manago/
├── app/                # Controller, Model, Policy, Service
├── resources/
│   └── js/             # React + Inertia pages and components
│       ├── components/
│       └── pages/
├── routes/             # web.php
├── database/           # Migration & seeder
├── public/             # Aset publik
├── tests/              # Unit & Feature tests
├── .env.example
├── package.json
├── composer.json
└── README.md
```

---

## 🧪 Testing

Untuk pengujian Laravel:

```bash
php artisan test
```

Untuk pengujian frontend (jika tersedia):

```bash
npm run test
```

---

## 🤝 Kontribusi

Kontribusi sangat terbuka!  
Silakan:

1. Fork repository ini
2. Buat branch fitur atau perbaikan
3. Kirim pull request dengan deskripsi yang jelas

---

## 📄 Lisensi

Lisensi: [MIT License](LICENSE)

---

## 📢 Catatan Tambahan

> Dokumentasi ini masih dapat dikembangkan.  
> - Panduan testing atau CI/CD

---

**Manago** - Kelola tugas dan keuangan Anda dengan efisien.
