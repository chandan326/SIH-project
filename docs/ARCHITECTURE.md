# BhoomiVerify Architecture & Technical Design

## Architecture Principles

BhoomiVerify is designed as a **decoupled, event-ready, microservices-compatible architecture** prioritizing geospatial accuracy, explainable verification logic, and seamless future government data integration.

### Core Architectural Layers

1. **Presentation Layer (Next.js 14 App Router)**
   - Built with React 18, TypeScript, Tailwind CSS, shadcn/ui.
   - Client-side interactive GIS map rendering using Google Maps API + custom SVG overlay engine.
   - Client-side state management via TanStack Query.

2. **API & Business Logic Layer (FastAPI / Python 3.12)**
   - Asynchronous RESTful API endpoints.
   - Pydantic v2 data validation schemas.
   - RBAC security dependencies (`PUBLIC`, `BUYER`, `REVIEWER`, `ADMIN`, `SUPER_ADMIN`).

3. **Data Provider Abstraction Layer**
   - Abstract `LandRecordProvider`, `RegistrationProvider`, `MutationProvider`, `CadastralProvider`.
   - Active `SyntheticLandRecordProvider` querying local PostGIS database.
   - Extensible `FutureGovernmentLandRecordProvider` stub for live state revenue portal APIs.

4. **Engine Layer**
   - **Verification Engine**: Deterministic rule-based 0-100 scoring logic.
   - **GIS Engine**: Shapely, PyProj, PostGIS geodesic area & perimeter computation.
   - **ML Anomaly Detector**: Scikit-Learn Random Forest model extracting feature importances.
   - **Bhoomi Assistant**: Conversational AI query engine with legal title safety guardrails.

5. **Persistence Layer (PostgreSQL 16 + PostGIS 3.4 & Redis)**
   - Geodesic spatial indexes (`GIST(geometry)`).
   - Redis for caching, rate limiting, and session state.

---

## Data Provider Abstraction Pattern

```
                       ┌──────────────────────────────┐
                       │      FastAPI Services        │
                       └──────────────┬───────────────┘
                                      │
                       ┌──────────────▼───────────────┐
                       │     LandRecordProvider       │
                       │     (Abstract Interface)     │
                       └──────────────┬───────────────┘
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
┌───────────▼─────────────────────┐             ┌───────────────▼────────────────┐
│  SyntheticLandRecordProvider    │             │ FutureGovernmentLandRecordProvider│
│  (Queries PostgreSQL/PostGIS)   │             │ (API Adapter to DILRMP / State)│
└─────────────────────────────────┘             └────────────────────────────────┘
```
