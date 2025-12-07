# 🚀 Portfolio Project - Deployment Guide

## 📋 Quick Setup dengan File Tunggal

Untuk deploy ulang project portfolio dengan mudah, gunakan file `COMPLETE_DATABASE_SETUP.sql` yang sudah dibuat.

### 🎯 Langkah-langkah Deploy:

#### 1. **Setup Database (Supabase)**
```bash
# Buka Supabase Dashboard
# Masuk ke SQL Editor
# Copy dan paste seluruh isi file COMPLETE_DATABASE_SETUP.sql
# Klik "Run" untuk menjalankan script
```

#### 2. **Setup Environment Variables**
```bash
# Copy file .env.example ke .env
cp .env.example .env

# Update dengan konfigurasi Supabase Anda:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### 3. **Install Dependencies**
```bash
npm install
```

#### 4. **Run Development Server**
```bash
npm run dev
```

#### 5. **Build untuk Production**
```bash
npm run build
```

---

## 📁 File Setup yang Tersedia

| File | Deskripsi | Kapan Digunakan |
|------|-----------|-----------------|
| `COMPLETE_DATABASE_SETUP.sql` | **File utama** - Setup lengkap database dalam satu file | **Gunakan ini untuk deploy baru** |
| `01_SETUP_DATABASE.sql` | Setup grants, policies, dan views | Sudah termasuk dalam file utama |
| `02_INSERT_SAMPLE_DATA.sql` | Data sample untuk testing | Sudah termasuk dalam file utama |
| `03_VERIFY_SETUP.sql` | Verifikasi setup database | Sudah termasuk dalam file utama |
| `04_TROUBLESHOOTING.sql` | Panduan troubleshooting | Referensi jika ada masalah |

---

## 🔧 Fitur yang Tersedia

### ✅ Database Tables
- **profiles** - Informasi developer
- **skills** - Keahlian teknis
- **projects** - Portfolio projects
- **contacts** - Pesan dari contact form
- **images** - Manajemen gambar

### ✅ Security Features
- Row Level Security (RLS) enabled
- Public read access untuk data portfolio
- Authenticated user access untuk admin
- Proper policies untuk setiap table

### ✅ Sample Data
- Profile developer sample
- 10 skills dengan kategori berbeda
- 3 project portfolio
- 3 contact messages
- 3 sample images

### ✅ Performance Optimizations
- Database indexes untuk query yang cepat
- Public views untuk data yang sering diakses
- Auto-update triggers untuk timestamps

---

## 🎨 Customization

### Mengganti Data Sample
1. Buka Supabase Dashboard
2. Masuk ke Table Editor
3. Edit data di table yang sesuai:
   - `profiles` - Update informasi pribadi
   - `skills` - Tambah/edit keahlian
   - `projects` - Update portfolio projects
   - `images` - Upload gambar sendiri

### Menambah Data Baru
```sql
-- Contoh: Menambah skill baru
INSERT INTO skills (name, category, level, color, is_featured) 
VALUES ('Vue.js', 'Frontend', 85, '#4FC08D', true);

-- Contoh: Menambah project baru
INSERT INTO projects (title, description, tech_stack, status, is_featured) 
VALUES ('My New App', 'Description here', ARRAY['React', 'Node.js'], 'published', true);
```

---

## 🚨 Troubleshooting

### Database Connection Issues
1. Pastikan environment variables sudah benar
2. Check Supabase project status
3. Verify API keys dan URL

### Permission Errors
1. Pastikan RLS policies sudah dibuat
2. Check user authentication status
3. Verify grants untuk public/authenticated users

### Data Tidak Muncul
1. Check status project (harus 'published')
2. Verify is_active untuk images
3. Check is_featured untuk featured items

---

## 📞 Support

Jika mengalami masalah:
1. Check file `04_TROUBLESHOOTING.sql` untuk panduan detail
2. Review Supabase logs di Dashboard
3. Pastikan semua dependencies terinstall dengan benar

---

## 🎉 Selamat!

Database portfolio Anda sudah siap digunakan! File `COMPLETE_DATABASE_SETUP.sql` memudahkan deployment ulang kapan saja.