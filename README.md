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

## 📂 Arsitektur Direktori

```text
.
├── api/
│   └── index.js          # Core Serverless Logic & API Endpoints
├── public/
│   ├── index.html        # Entry Point & Optimized UI Structure
│   ├── script.js         # Reactive Dashboard Logic & Monitoring Engine
│   └── style.css         # Modern UI System & Micro-animations
├── package.json          # Node.js Project Manifest
├── vercel.json           # Production Deployment Configuration
├── LICENSE               # Legal Terms (MIT License)
└── README.md             # Technical Documentation
```
