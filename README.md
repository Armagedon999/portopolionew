# 🚀 Portfolio Website - Setup Guide

## 📋 **Quick Setup:**

### **1. Database Setup**
```sql
-- Copy paste 01_SETUP_DATABASE.sql ke SQL Editor Supabase
```

### **2. Sample Data**
```sql
-- Copy paste 02_INSERT_SAMPLE_DATA.sql ke SQL Editor Supabase
```

### **3. Verify (Optional)**
```sql
-- Copy paste 03_VERIFY_SETUP.sql ke SQL Editor Supabase
```

### **4. Troubleshooting (If Needed)**
```sql
-- Copy paste 04_TROUBLESHOOTING.sql ke SQL Editor Supabase
```

## 📁 **File Structure:**

```
protopolio/
├── 01_SETUP_DATABASE.sql      # Setup grants, policies, views
├── 02_INSERT_SAMPLE_DATA.sql  # Insert sample data
├── 03_VERIFY_SETUP.sql        # Verify setup
├── 04_TROUBLESHOOTING.sql     # Troubleshooting queries
├── SETUP_GUIDE.md             # Complete setup guide
└── README.md                  # This file
```

## ✅ **Features:**

- ✅ **About Component** - Menampilkan data dari database
- ✅ **Image Management** - CRUD untuk images
- ✅ **Profile Management** - CRUD untuk profile
- ✅ **Skills Management** - CRUD untuk skills
- ✅ **Projects Management** - CRUD untuk projects
- ✅ **Contact Management** - CRUD untuk contacts
- ✅ **Admin Panel** - Interface untuk manage data

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

## 🎯 **Test:**

1. **Refresh halaman About**
2. **Cek console browser (F12)**
3. **Lihat debug logs**
4. **Pastikan data terpanggil**

---

**Setup selesai! Portfolio siap digunakan! 🎉**# portopolionew
