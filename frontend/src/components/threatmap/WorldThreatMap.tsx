import { useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Spin, Alert } from 'antd';
import type { GeoOriginPoint } from '@/data/geoOrigins';
import { colorForSeverity } from '@/data/geoOrigins';
import { SOC } from '@/theme/socTokens';

/** Ocean fill — saturated blue like Microsoft Sentinel workbooks */
const MAP_OCEAN = '#1473d9';
const MAP_LAND = '#030305';
const MAP_BORDER = 'rgba(200, 225, 255, 0.55)';

const WORLD_MAP_URL =
  'https://raw.githubusercontent.com/apache/echarts/master/test/data/map/json/world.json';

let worldMapLoadPromise: Promise<void> | null = null;

function ensureWorldMapRegistered(): Promise<void> {
  if (echarts.getMap?.('world')) {
    return Promise.resolve();
  }
  if (!worldMapLoadPromise) {
    worldMapLoadPromise = fetch(WORLD_MAP_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Map load failed: ${r.status}`);
        return r.json();
      })
      .then((geoJson) => {
        echarts.registerMap('world', geoJson);
      })
      .catch((err) => {
        worldMapLoadPromise = null;
        throw err;
      });
  }
  return worldMapLoadPromise;
}

interface WorldThreatMapProps {
  points: GeoOriginPoint[];
  height?: number;
}

export const WorldThreatMap = ({ points, height = 420 }: WorldThreatMapProps) => {
  const [mapReady, setMapReady] = useState(!!echarts.getMap?.('world'));
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureWorldMapRegistered()
      .then(() => {
        if (!cancelled) setMapReady(true);
      })
      .catch((e: Error) => {
        if (!cancelled) setMapError(e.message || 'Could not load world map');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scatterData = useMemo(
    () =>
      points.map((p) => {
        const color = colorForSeverity(p.severity);
        return {
          name: p.country,
          value: [p.lng, p.lat, p.count] as [number, number, number],
          itemStyle: {
            color,
            opacity: 0.42,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.45)',
            shadowBlur: 28,
            shadowColor: `${color}77`,
          },
          origin: p,
        };
      }),
    [points]
  );

  const option = useMemo(
    () => ({
      backgroundColor: MAP_OCEAN,
      tooltip: {
        trigger: 'item' as const,
        backgroundColor: 'rgba(8, 12, 22, 0.92)',
        borderColor: 'rgba(255,255,255,0.25)',
        textStyle: { color: '#f0f4ff' },
        formatter: (params: {
          data?: { origin?: GeoOriginPoint; name?: string; value?: number[] };
        }) => {
          const o = params.data?.origin;
          if (!o) return '';
          return `
            <div style="padding:4px 2px;max-width:280px;">
              <strong>${o.country}</strong><br/>
              <span style="color:#9fb0d0">Events:</span> ${o.count.toLocaleString()}<br/>
              <span style="color:#9fb0d0">Sample IP:</span> <code>${o.sampleIp}</code><br/>
              <span style="color:#9fb0d0">Source:</span> ${o.source}<br/>
              <span style="color:#9fb0d0">Severity:</span> ${o.severity}
            </div>
          `;
        },
      },
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.05,
        center: [15, 24],
        scaleLimit: { min: 0.8, max: 6 },
        itemStyle: {
          areaColor: MAP_LAND,
          borderColor: MAP_BORDER,
          borderWidth: 0.75,
        },
        emphasis: {
          disabled: false,
          itemStyle: {
            areaColor: '#101018',
            borderColor: 'rgba(255,255,255,0.85)',
            borderWidth: 1,
          },
          label: { show: false },
        },
      },
      series: [
        {
          name: 'Log origins',
          type: 'scatter' as const,
          coordinateSystem: 'geo' as const,
          data: scatterData,
          symbolSize: (val: number[]) => {
            const n = val[2] ?? 0;
            return Math.min(68, 14 + Math.sqrt(n) * 0.82);
          },
          emphasis: {
            scale: 1.1,
            itemStyle: {
              opacity: 0.58,
              shadowBlur: 34,
              borderWidth: 1.25,
              borderColor: 'rgba(255,255,255,0.8)',
            },
          },
        },
      ],
    }),
    [scatterData]
  );

  if (mapError) {
    return (
      <Alert
        type="warning"
        showIcon
        message="World map could not load"
        description={
          <>
            Check network access to GitHub raw content, or host <code>world.json</code> under{' '}
            <code>/public/geo/</code>. {mapError}
          </>
        }
      />
    );
  }

  if (!mapReady) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: MAP_OCEAN,
          borderRadius: SOC.radius,
        }}
      >
        <Spin tip="Loading world map…" />
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%', borderRadius: SOC.radius }}
      notMerge
      lazyUpdate
      opts={{ renderer: 'canvas' }}
    />
  );
};
