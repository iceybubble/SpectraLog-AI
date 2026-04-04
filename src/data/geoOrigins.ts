/**
 * Approximate country centroids for plotting log / attack origins on a world map.
 * Replace or enrich via backend GeoIP when available.
 */
export interface GeoOriginPoint {
  country: string;
  iso2: string;
  lng: number;
  lat: number;
  count: number;
  sampleIp: string;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastSeen: string;
}

/** Demo dataset — Sentinel-style “failed auth / RDP” narrative */
export const DEMO_GEO_ORIGINS: GeoOriginPoint[] = [
  {
    country: 'United States',
    iso2: 'US',
    lng: -98.35,
    lat: 39.5,
    count: 4521,
    sampleIp: '185.220.101.44',
    source: 'windows',
    severity: 'high',
    lastSeen: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    country: 'Netherlands',
    iso2: 'NL',
    lng: 5.29,
    lat: 52.13,
    count: 5521,
    sampleIp: '45.142.212.61',
    source: 'server',
    severity: 'critical',
    lastSeen: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    country: 'Sweden',
    iso2: 'SE',
    lng: 18.64,
    lat: 60.13,
    count: 1451,
    sampleIp: '185.156.174.34',
    source: 'cloud',
    severity: 'medium',
    lastSeen: new Date(Date.now() - 1800_000).toISOString(),
  },
  {
    country: 'Philippines',
    iso2: 'PH',
    lng: 122.56,
    lat: 11.78,
    count: 1440,
    sampleIp: '103.251.214.88',
    source: 'iot',
    severity: 'medium',
    lastSeen: new Date(Date.now() - 900_000).toISOString(),
  },
  {
    country: 'Australia',
    iso2: 'AU',
    lng: 133.78,
    lat: -25.27,
    count: 77,
    sampleIp: '203.45.112.9',
    source: 'windows',
    severity: 'low',
    lastSeen: new Date(Date.now() - 14_400_000).toISOString(),
  },
  {
    country: 'Hungary',
    iso2: 'HU',
    lng: 19.5,
    lat: 47.16,
    count: 892,
    sampleIp: '84.2.233.101',
    source: 'server',
    severity: 'high',
    lastSeen: new Date(Date.now() - 450_000).toISOString(),
  },
  {
    country: 'Kazakhstan',
    iso2: 'KZ',
    lng: 66.92,
    lat: 48.02,
    count: 1203,
    sampleIp: '95.56.112.77',
    source: 'android',
    severity: 'high',
    lastSeen: new Date(Date.now() - 600_000).toISOString(),
  },
  {
    country: 'Indonesia',
    iso2: 'ID',
    lng: 113.92,
    lat: -0.79,
    count: 2104,
    sampleIp: '182.253.44.12',
    source: 'iot',
    severity: 'medium',
    lastSeen: new Date(Date.now() - 2700_000).toISOString(),
  },
  {
    country: 'Brazil',
    iso2: 'BR',
    lng: -51.93,
    lat: -14.24,
    count: 1677,
    sampleIp: '177.234.88.55',
    source: 'windows',
    severity: 'medium',
    lastSeen: new Date(Date.now() - 5400_000).toISOString(),
  },
  {
    country: 'Germany',
    iso2: 'DE',
    lng: 10.45,
    lat: 51.16,
    count: 2340,
    sampleIp: '88.99.12.3',
    source: 'server',
    severity: 'low',
    lastSeen: new Date(Date.now() - 10_800_000).toISOString(),
  },
];

/** High-contrast “Sentinel workbook” palette for map bubbles */
const severityColor: Record<GeoOriginPoint['severity'], string> = {
  critical: '#ff1744',
  high: '#ff9100',
  medium: '#ffea00',
  low: '#00e5ff',
};

export function colorForSeverity(s: GeoOriginPoint['severity']): string {
  return severityColor[s];
}

export function filterByRegion(
  points: GeoOriginPoint[],
  iso2: string | undefined
): GeoOriginPoint[] {
  if (!iso2) return points;
  return points.filter((p) => p.iso2 === iso2);
}
