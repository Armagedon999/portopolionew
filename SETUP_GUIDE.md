# 🚀 Setup Portfolio Database - Complete Guide

## 📋 **Langkah Setup:**

### **Step 1: Setup Database**
```sql
-- Copy paste 01_SETUP_DATABASE.sql ke SQL Editor Supabase
```
**Fungsi:** Setup grants, policies, views, dan triggers

### **Step 2: Insert Sample Data**
```sql
-- Copy paste 02_INSERT_SAMPLE_DATA.sql ke SQL Editor Supabase
```
**Fungsi:** Insert data sample untuk testing

### **Step 3: Verify Setup**
```sql
-- Copy paste 03_VERIFY_SETUP.sql ke SQL Editor Supabase
```
**Fungsi:** Verifikasi setup database

### **Step 4: Troubleshooting (Jika Ada Masalah)**
```sql
-- Copy paste 04_TROUBLESHOOTING.sql ke SQL Editor Supabase
```
**Fungsi:** Query untuk mengatasi masalah

## 📁 **File SQL:**

| File | Fungsi | Kapan Digunakan |
|------|--------|-----------------|
| `01_SETUP_DATABASE.sql` | Setup grants, policies, views, triggers | **WAJIB** - Langkah pertama |
| `02_INSERT_SAMPLE_DATA.sql` | Insert data sample | **WAJIB** - Langkah kedua |
| `03_VERIFY_SETUP.sql` | Verifikasi setup | **OPSIONAL** - Untuk cek hasil |
| `04_TROUBLESHOOTING.sql` | Troubleshooting | **OPSIONAL** - Jika ada masalah |

## ✅ **Hasil Setup:**

Setelah setup selesai, database akan memiliki:

- ✅ **Grants** - Permissions untuk public, authenticated, service_role
- ✅ **RLS Policies** - Keamanan untuk semua table
- ✅ **Public Views** - Akses data yang terkontrol
- ✅ **Triggers** - Auto-update updated_at
- ✅ **Sample Data** - Data untuk testing

## 🔍 **Troubleshooting:**

### **Gambar tidak muncul:**
```sql
SELECT * FROM images WHERE section = 'about';
```

### **Profile kosong:**
```sql
SELECT * FROM profiles;
```

### **Cek relationship:**
```sql
SELECT p.full_name, ai.url as about_image_url
FROM profiles p
LEFT JOIN images ai ON p.about_image_id = ai.id;
```

### **Error umum:**
- **"relation does not exist"** → Jalankan migration sebelumnya
- **"permission denied"** → Jalankan sebagai superuser
- **"duplicate key value"** → Data sudah ada, normal
- **"foreign key constraint fails"** → Data parent belum ada

## 🎯 **Test Setup:**

1. **Refresh halaman About**
2. **Cek console browser (F12)**
3. **Lihat debug logs**
4. **Pastikan data terpanggil**

## 📝 **Catatan Penting:**

1. **Urutan penting** - Jalankan file SQL sesuai urutan
2. **Superuser** - Beberapa query perlu superuser access
3. **Error handling** - Gunakan troubleshooting jika ada masalah
4. **Verification** - Selalu verify setup setelah selesai

---

**Setup database selesai! Portfolio siap digunakan! 🎉**