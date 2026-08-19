# BhoomiVerify Security Architecture & Legal Safety

## Role-Based Access Control (RBAC)

BhoomiVerify enforces 5 granular user roles across API endpoints:

1. `PUBLIC`: Search parcels, view maps, measure land, view verification reports.
2. `BUYER`: Save parcels, due diligence checklist, risk indicators, detailed parcel history.
3. `REVIEWER`: Access textual and spatial datasets, review record mismatches, approve/reject demo submissions.
4. `ADMIN`: Dataset versioning, GeoJSON validation, security audit log access.
5. `SUPER_ADMIN`: Manage users, RBAC permissions, system health configurations.

## Legal Safety & Guardrails

The application enforces explicit disclaimers:
- **Disclaimer Banner**: Displayed prominently on every screen.
- **Bhoomi Assistant Guardrail**: Automatically intercepts queries asking "Who legally owns this property?" or "Is this land safe to buy?" and responds:
  > "I cannot determine legal ownership or guarantee title safety from this prototype. This application uses synthetic demonstration data for system testing only."

## Cryptographic Report Verification

Generated PDF reports receive a unique Report ID (`BV-DEMO-YYYY-XXXXXX`) and a SHA-256 hash stored in the report registry. The hash can be publicly verified at `/verify-report/{report_id}` to confirm document integrity.
