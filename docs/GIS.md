# BhoomiVerify GIS & Geodesic Math Documentation

## Spatial Coordinates & Coordinate Reference System (CRS)

- **Storage CRS**: EPSG:4326 (WGS84 Latitude / Longitude).
- **Geometry Type**: `MULTIPOLYGON` stored in PostGIS with spatial GIST index.

## Geodesic Area & Perimeter Calculation

Land measurement must never be computed using simple degree arithmetic ($\Delta x \times \Delta y$). BhoomiVerify uses geodesic spherical polygon calculations on the WGS84 ellipsoid model ($R = 6,378,137\text{ m}$):

$$\text{Area} = \frac{R^2}{2} \sum_{i=1}^{n-1} (\lambda_{i+1} - \lambda_i)(2 + \sin\phi_i + \sin\phi_{i+1})$$

Where $\phi$ is latitude and $\lambda$ is longitude in radians.

## Configured Regional Land Unit Conversions

Indian states use distinct traditional land area units. BhoomiVerify implements a state-aware conversion table:

| State Context | Unit | Multiplier to Sq. Meters |
|---|---|---|
| **Maharanya** | Guntha | 101.17 m² |
| **Maharanya** | Bigha | 2,500.0 m² |
| **Uttar Pradesh Demo** | Pucca Bigha | 2,529.3 m² |
| **Uttar Pradesh Demo** | Biswa | 126.46 m² |
| **Karnapur** | Guntha | 101.17 m² |
| **Karnapur** | Cents | 40.4686 m² |
| **Rajasthan Demo** | Bigha | 2,722.5 m² |
| **Standard** | Acre | 4,046.86 m² |
| **Standard** | Hectare | 10,000.0 m² |
