# 🏞️ BhoomiVerify — Land Verification & Parcel Intelligence Platform

> **Smart India Hackathon (SIH) Project**  
> *Mapping Land. Connecting Records. Improving Transparency.*

---

## 📌 Project Overview
**BhoomiVerify** is a next-generation Geospatial Land Parcel Intelligence and Cadastral Record Consistency Verification System. It unifies spatial map data (Leaflet GIS + Google Hybrid Maps) with land revenue records (Record of Rights / Khata 7/12, Registration Deeds, Mutation Audits, Encumbrances) to prevent land disputes, boundary overlaps, and fraudulent transactions.

---

## ✨ Key Features

- 🗺️ **Interactive GIS Map Explorer**: High-precision Leaflet map with satellite hybrid layer, coordinate search, and direct Google Maps linking.
- 📐 **Geodesic Land Measurement**: Accurate polygon area calculation with automatic unit conversion across Guntha, Bigha, Biswa, Square Meters, and Acres.
- 🛡️ **Cryptographic Title Audit**: Automated consistency scoring (0-100) analyzing discrepancies between spatial boundaries and revenue records.
- 🔴 **Real-Time Revenue Notice Board**: Blinking alert system for public survey updates, mutation drives, and state circulars.
- 🌐 **Multi-Language Support**: Complete i18n support for 11 Indian regional state languages (Hindi, Marathi, Kannada, Tamil, Telugu, Gujarati, Bengali, Malayalam, Punjabi, Odia, English).
- 🎬 **Dedicated Fullscreen Video Theater**: Embedded video demonstration page (`/demo-video`) with custom playback and browser-style controls.
- 🎨 **3 Color Themes**: Dark Mode, Creamy White, and Study Dim Light.

---

## 👥 Project Team & Contributors

| Name | Role |
| :--- | :--- |
| **Chandan Kumar Rai** | **Full Stack Backend Developer** (Team Lead) |
| **Manshi** | **Frontend Developer** |
| **Nishchay** | **AI Developer** |
| **Aditya** | **Content Creator** |
| **Harshit** | **Bug Catcher & QA Engineer** |

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Leaflet.js, Lucide Icons
- **Backend**: FastAPI (Python), SQLAlchemy, SQLite, Spatial Analytics Engine
- **Deployment**: Local Hosting (Port 3000 & 8000)

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **`http://localhost:3000`** in your browser.
