# BhoomiVerify — Production-Grade Land Verification & Parcel Intelligence Platform

> **"Mapping Land. Connecting Records. Improving Transparency."**

> **DEMO DATA DISCLAIMER**: This prototype uses synthetic demonstration data and does NOT establish legal ownership, title, registration status, or encumbrance of any real property.

---

## 🌟 Overview

**BhoomiVerify** is a production-grade geospatial land verification and parcel intelligence web platform designed for India using synthetic demonstration data. It demonstrates how a future government-integrated system could help identify, verify, analyze, and visualize land parcels across India.

### Key Capabilities

1. **Interactive Cadastral GIS Explorer**: Visualizes PostGIS MultiPolygon parcel geometries, centroids, and bounding boxes on interactive maps.
2. **Deterministic Verification Engine**: Rule-based evaluation comparing spatial cadastral geometries against textual Record of Rights (RoR), deed registrations, mutation logs, encumbrance records, and court disputes.
3. **Transparent Consistency Score (0–100)**: Calculates an explainable score with clear reasons for every point deduction.
4. **Geodesic Land Measurement & Regional Unit Engine**: Computes spherical geodesic area/perimeter and converts square meters into regional Indian land units (Bigha, Guntha, Biswa, Decimal, Katha, Cents, Acre, Hectare) based on state rules.
5. **Cryptographic PDF Report & Hash Verification**: Generates downloadable PDF reports with Report ID, QR code, and SHA-256 integrity hash verification (`/verify-report/{report_id}`).
6. **Bhoomi Assistant AI**: Floating AI assistant with strict legal title guardrails.
7. **Admin & Reviewer Portal**: Dataset version management (synthetic GeoJSON validation), security audit logging, and reviewer analytics.

---

## 🚀 Quickstart Guide

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.12+ (for local backend development)

### 1-Command Docker Setup

```bash
# Clone repository and start all services
docker compose up --build
```

Services started:
- **Frontend (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **Backend API (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **PostgreSQL + PostGIS**: `localhost:5432`
- **Redis Cache**: `localhost:6379`

---

## 👥 Roles & Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Public User** | `public@bhoomiverify.demo` | `public123` | Search, View Map, Measure Land, View Reports |
| **Prospective Buyer** | `buyer@bhoomiverify.demo` | `buyer123` | Checklist, Risk Analysis, Save Parcels |
| **Govt Reviewer** | `reviewer@bhoomiverify.demo` | `reviewer123` | Mismatch Triage, Submission Verification, Analytics |
| **Administrator** | `admin@bhoomiverify.demo` | `admin123` | Dataset Management, Audit Logs, API Settings |
| **Super Admin** | `superadmin@bhoomiverify.demo` | `super123` | User & Role Management, System Configuration |

---

## 🗺️ Synthetic Data Quality Scenarios

The seed dataset contains 500+ synthetic parcels demonstrating 10 real-world data scenarios:
1. **Fully Consistent**: RoR + Registration + Mutation + Spatial Match
2. **Registration Missing**: Spatial geometry exists but missing deed registration
3. **Area Mismatch**: Recorded RoR area differs from spatial geometry area (> 5%)
4. **Geometry Invalid**: Self-intersecting parcel boundary
5. **Mutation Pending**: Registration complete but mutation status pending
6. **Active Encumbrance**: Mortgage / bank lien active in demo records
7. **Active Dispute**: Court case / stay order active
8. **Spatial Overlap**: Intersecting parcel geometries
9. **Incomplete Data**: Missing key textual fields
10. **Joint Khata**: Multi-holder share allocation

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/         # FastAPI Versioned Endpoints
│   │   ├── core/           # Security, Config, Database, Logging
│   │   ├── models/         # SQLAlchemy PostGIS Spatial Models
│   │   ├── providers/      # Data Provider Abstraction (Synthetic / Govt Stubs)
│   │   ├── schemas/        # Pydantic v2 Schemas
│   │   ├── services/       # Verification, Spatial, Report, ML, Assistant Services
│   │   └── utils/          # GIS Math & PDF Generator
│   ├── scripts/            # Seed Data Generator Script
│   ├── tests/              # Pytest Unit & Spatial Tests
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js 14 App Router Pages
│   │   ├── components/     # UI Components (Map, Drawer, Checklist, Assistant)
│   │   └── lib/            # API Client Utilities
│   └── Dockerfile
├── docs/                   # Architecture, API, Database, GIS, & Security Documentation
└── docker-compose.yml
```
