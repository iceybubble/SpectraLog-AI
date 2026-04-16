# SpectraLog AI - Frontend

Modern web interface for SpectraLog AI, an AI-powered and explainable forensic SIEM platform.

## Overview

This frontend now includes a dark SOC-style dashboard, investigation pages, a threat map, and demo/mock data support so the UI can run even before the backend is fully ready.

Current functional areas:

- **SOC Dashboard** - KPI cards, charts, open alerts table, and analyst-focused layout
- **Logs Explorer** - Filtering, pagination, and detail modal for logs
- **Alerts** - Alerts list and alert details
- **Timeline** - Attack timeline visualization
- **Correlation** - Correlation graph view
- **Threat Map** - World map view for event origins by IP/country
- **Overview / Severity / Live Attacks / Affected Systems** - Additional SOC navigation pages inspired by SIEM dashboards
- **Mock Mode** - Built-in demo data when the backend is unavailable

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Ant Design**
- **Apache ECharts**
- **React Query**
- **Zustand**
- **React Router**
- **Axios**

## Installation

```bash
npm install
npm run dev
```

Other useful commands:

```bash
npm run build
npm run lint
npm run preview
```

## Configuration

Use `.env.example` as the reference:

```bash
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=true
```

Environment variables:

- `VITE_API_URL` - Backend base URL
- `VITE_USE_MOCK` - If `true`, the frontend uses local demo data from `src/services/mockData.ts`

Recommended setup:

1. Copy `.env.example` to `.env`
2. Set `VITE_USE_MOCK=true` for frontend-only demo mode
3. Set `VITE_USE_MOCK=false` when the backend APIs are available

## Routes / Pages

Main routes currently available:

- `/` - SOC dashboard
- `/overview` - Global filters view
- `/severity` - Alert prioritization view
- `/live-attacks` - Recent attack/log activity
- `/threat-map` - World threat map
- `/affected-systems` - Asset status view
- `/logs` - Logs explorer
- `/alerts` - Alerts list
- `/alerts/:id` - Alert details
- `/timeline` - Timeline reconstruction
- `/correlation` - Correlation page

## New Frontend Files Added

The following files were added during the SOC dashboard and threat-map expansion:

### Theme

- `src/theme/socTokens.ts` - Shared SOC color palette and UI tokens
- `src/theme/socAntdTheme.ts` - Ant Design dark theme configuration

### Dashboard Components

- `src/components/dashboard/SocDashboardChrome.tsx` - Top tabs/filter strip
- `src/components/dashboard/SocDashboardCharts.tsx` - Dashboard chart widgets

### Threat Map

- `src/components/threatmap/WorldThreatMap.tsx` - ECharts world map with geo scatter bubbles
- `src/data/geoOrigins.ts` - Demo geo-origin dataset and map color helpers
- `src/pages/ThreatMap.tsx` - Threat map page

### New Pages

- `src/pages/Alerts.tsx`
- `src/pages/Overview.tsx`
- `src/pages/Severity.tsx`
- `src/pages/LiveAttacks.tsx`
- `src/pages/AffectedSystems.tsx`

### API / Mock Data

- `src/services/mockData.ts` - Built-in demo dataset for frontend-only mode

## Project Structure

```text
src/
├── components/
│   ├── correlation/
│   ├── dashboard/
│   ├── layout/
│   ├── logs/
│   ├── threatmap/
│   ├── timeline/
│   └── xai/
├── data/
├── pages/
├── services/
├── store/
├── theme/
├── types/
└── assets/
```

## Backend Integration

This frontend connects to the SpectraLog AI backend API. By default it expects the backend on `http://localhost:8000`.

If the backend is not ready yet, keep `VITE_USE_MOCK=true`.

### Existing Backend Endpoints Used

- `GET /api/v1/logs` - Fetch logs
- `GET /api/v1/logs/:id` - Fetch single log details
- `POST /api/v1/logs/search` - Search logs
- `GET /api/v1/alerts` - Fetch alerts
- `GET /api/v1/alerts/:id` - Fetch alert details
- `POST /api/v1/alerts/:id/acknowledge` - Acknowledge an alert
- `PATCH /api/v1/alerts/:id` - Update alert status
- `GET /api/v1/dashboard/metrics` - Dashboard KPI metrics
- `GET /api/v1/correlation/timeline` - Timeline reconstruction data
- `GET /api/v1/correlation/graph/:id` - Correlation graph data
- `GET /api/v1/xai/explain/:id` - XAI explanation for an alert
- `GET /api/v1/enrichment/ip/:ip` - IP enrichment
- `GET /api/v1/enrichment/threat-intel/:indicator` - Threat intel lookup

## Backend Work Needed

To fully support the current frontend beyond mock mode, the backend should add or confirm the following:

### 1. Dashboard Metrics Response

The dashboard expects:

```json
{
  "total_logs": 1240893,
  "total_alerts": 42,
  "critical_alerts": 3,
  "open_investigations": 5,
  "devices_monitored": 128,
  "threat_score": 0.35
}
```

### 2. Threat Map / GeoIP Data

Right now the map uses demo geo data from `src/data/geoOrigins.ts`. For real-world map behavior, the backend should add:

- IP-to-geo enrichment using a GeoIP provider or local geo database
- Latitude/longitude or country-level coordinates for suspicious events
- Event counts grouped by source geography
- Last-seen timestamp and example/source IP

Recommended new backend endpoint:

- `GET /api/v1/threat-map/origins`

Suggested response shape:

```json
[
  {
    "country": "Netherlands",
    "iso2": "NL",
    "lng": 5.29,
    "lat": 52.13,
    "count": 5521,
    "sample_ip": "45.142.212.61",
    "source": "server",
    "severity": "critical",
    "last_seen": "2026-04-04T12:00:00Z"
  }
]
```

### 3. Asset / Affected Systems Data

The current `/affected-systems` page is mock-based. Recommended new backend endpoint:

- `GET /api/v1/assets/affected`

Suggested response shape:

```json
[
  {
    "id": "a1",
    "hostname": "WS-FIN-0142",
    "type": "Endpoint",
    "region": "US-East",
    "risk": 72,
    "status": "Investigating",
    "last_seen": "2026-04-04T14:20:00Z"
  }
]
```

### 4. Live Attacks Stream

The `/live-attacks` page currently reuses recent logs. If you want a more SIEM-like live feed, consider adding:

- `GET /api/v1/live-attacks`

or a websocket/stream endpoint for near-real-time updates.

### 5. Backend Files You Will Likely Need

Exact filenames depend on your backend stack, but you will likely need:

- A **threat map route/controller** for `/api/v1/threat-map/origins`
- A **GeoIP service/module** to resolve IP -> country/lat/lng
- An **assets route/controller** for `/api/v1/assets/affected`
- Optional **live attacks route/service** if you want a dedicated stream instead of generic logs
- Schema/DTO/serializer updates for the new response shapes above

## Notes

- The world map currently loads `world.json` dynamically for ECharts.
- The map is designed to look closer to Microsoft Sentinel workbook styling.
- If external map loading is restricted, host the world GeoJSON from the backend or the frontend `public/` folder.

## License

MIT License - Educational and Research Use

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.