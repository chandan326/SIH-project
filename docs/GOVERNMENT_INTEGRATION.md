# Future Government Data Integration Architecture

## Overview

BhoomiVerify is architected to transition seamlessly from synthetic demonstration data to authorized live government data providers without rewriting the core verification, spatial, scoring, or UI layers.

## Integration Extension Strategy

To connect a live state land record system (e.g., DILRMP, Mahabhulekh, UP Bhulekh, AnyRoR, Kaveri):

1. Implement `LandRecordProvider` in `app/providers/` (e.g. `MahabhulekhGovernmentProvider`).
2. Implement authenticated API token handshake & request signature.
3. Map state-specific JSON/XML fields to standard BhoomiVerify schemas:
   - `khasra_number` $\leftrightarrow$ State Khasra/Gat No.
   - `area_recorded` $\leftrightarrow$ State Recorded Hectares/Gunthas.
4. Swap the dependency injection in `app/main.py` from `SyntheticLandRecordProvider` to `MahabhulekhGovernmentProvider`.
