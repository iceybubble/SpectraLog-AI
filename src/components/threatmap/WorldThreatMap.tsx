import { useEffect, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Spin, Alert } from 'antd';
import type { GeoOriginPoint } from '@/data/geoOrigins';
import { colorForSeverity } from '@/data/geoOrigins';
import { SOC } from '@/theme/socTokens';

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
      points.map((p) => ({
        name: p.country,
        value: [p.lng, p.lat, p.count] as [number, number, number],
        itemStyle: { color: colorForSeverity(p.severity) },
        origin: p,
      })),
    [points]
  );

  const option = useMemo(
    () => ({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item' as const,
        backgroundColor: SOC.bgElevated,
        borderColor: SOC.border,
        textStyle: { color: SOC.text },
        formatter: (params: {
          data?: { origin?: GeoOriginPoint; name?: string; value?: number[] };
        }) => {
          const o = params.data?.origin;
          if (!o) return '';
          return `
            <div style="padding:4px 2px;max-width:280px;">
              <strong>${o.country}</strong><br/>
              <span style="color:${SOC.textMuted}">Events:</span> ${o.count.toLocaleString()}<br/>
              <span style="color:${SOC.textMuted}">Sample IP:</span> <code>${o.sampleIp}</code><br/>
              <span style="color:${SOC.textMuted}">Source:</span> ${o.source}<br/>
              <span style="color:${SOC.textMuted}">Severity:</span> ${o.severity}
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
          areaColor: '#12141c',
          borderColor: '#2a3340',
        },
        emphasis: {
          disabled: false,
          itemStyle: { areaColor: '#1c2230' },
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
            return Math.min(48, 12 + Math.sqrt(n) * 0.65);
          },
          emphasis: {
            scale: 1.15,
            itemStyle: { shadowBlur: 16, shadowColor: 'rgba(255,255,255,0.25)' },
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
          background: SOC.card,
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
      style={{ height, width: '100%' }}
      notMerge
      lazyUpdate
      opts={{ renderer: 'canvas' }}
    />
  );
};
