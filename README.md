# 🚀 WebMonitor: Advanced Real-Time Website Monitoring Solution

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![HTML-CSS-JS](https://img.shields.io/badge/Stack-HTML--CSS--JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-000000?style=for-the-badge&logo=vercel)
![GitHub](https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

## 📋 Deskripsi Proyek
**WebMonitor** adalah platform monitoring ketersediaan layanan (*uptime*) berbasis web yang dirancang untuk memberikan visibilitas *real-time* terhadap kesehatan infrastruktur digital Anda. Dibangun dengan pendekatan *lightweight architecture*, aplikasi ini mengintegrasikan efisiensi *client-side monitoring* dengan skalabilitas *serverless backend* untuk memberikan data latensi dan status ketersediaan yang akurat secara instan.

---

## 💎 Fitur Unggulan

* **Automated Uptime Tracking**: Sistem pengecekan otomatis dengan interval kustom (default 60 detik) untuk memastikan validitas status layanan.
* **Latency Analytics**: Metrik performa yang mengukur waktu respon server dalam milidetik (ms) untuk mendeteksi degradasi layanan lebih dini.
* **Interactive Data Visualization**: Dashboard analitik yang dilengkapi dengan *Proportional Pie Charts* dan *Dynamic Latency Bar Charts* untuk representasi data yang intuitif.
* **Smart Alerting System**: Integrasi dengan *Browser Notification API* yang memberikan peringatan kritis secara *real-time* meskipun tab aplikasi sedang berada di latar belakang.
* **Persistent Data Management**: Implementasi *LocalStorage* yang menjamin integritas data pengguna tanpa memerlukan manajemen database eksternal yang kompleks.

---

## 🛠️ Tech Stack & Integrasi

Core Engine: Python & JavaScript (ES6+).
API Framework: FastAPI untuk pengelolaan request yang asinkron dan berperforma tinggi.
Frontend Architecture: Modern HTML5 Semantic & CSS3 Grid/Flexbox untuk antarmuka yang sepenuhnya responsif.
Deployment Ecosystem: Vercel Serverless untuk menjamin ketersediaan aplikasi dengan latency rendah di tepi jaringan (at the edge).

## 🚀 Implementasi & Deployment
**1. Kloning Repository**
```bash
git clone [https://github.com/sanzzyproject/monitoring-website-.git](https://github.com/sanzzyproject/monitoring-website-.git)
```

**2. Eksekusi**

Aplikasi dapat dijalankan secara langsung melalui web server statis atau dengan membuka public/index.html pada browser modern yang mendukung standar ES6.

## 📂 Arsitektur Direktori

Berikut adalah struktur direktori dari proyek **monitoring-website**:
```text
.
├── app/
│   ├── routes/
│   │   ├── check.py        # Logika rute untuk pengecekan
│   │   └── health.py       # Logika rute untuk health check
│   ├── utils/
│   │   ├── http_client.py  # Utilitas untuk permintaan HTTP
│   │   └── validator.py    # Utilitas untuk validasi data
│   └── main.py             # Entry point aplikasi Python
├── public/
│   ├── index.html          # File HTML utama (Frontend)
│   ├── script.js           # Logika JavaScript client-side
│   └── style.css           # Styling CSS
├── LICENSE                 # File lisensi proyek
├── README.md               # Dokumentasi proyek
├── requirements.txt        # Daftar dependensi Python
└── vercel.json             # Konfigurasi deployment Vercel

```
## Strategi Deployment

Proyek ini dikonfigurasi secara spesifik untuk Vercel Infrastructure:
Hubungkan repositori GitHub ini ke dashboard Vercel.
Konfigurasi vercel.json akan secara otomatis mengatur routing dan fungsi API tanpa memerlukan intervensi manual tambahan.
