import React from "react";

export interface LineChartSeries {
  points: [number, number][];
  color?: string;
}

export interface LineChartProps {
  series: LineChartSeries[];
  height?: number;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
}

/**
 * LineChart — year-by-year price line. Coral line + faint area, hairline grid,
 * value dots, tabular axis labels. Supports 1–3 overlaid series.
 */
export default function LineChart({
  series,
  height = 220,
  colors = ["var(--accent)", "var(--trust)", "var(--neutral-400)"],
  style,
  className,
}: LineChartProps) {
  const pad = { l: 8, r: 12, t: 16, b: 26 };
  const W = 600, H = height;
  const all = series.flatMap((s) => s.points);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMax = Math.max(...ys) * 1.08, yMin = 0;
  const px = (x: number) => pad.l + ((x - xMin) / ((xMax - xMin) || 1)) * (W - pad.l - pad.r);
  const py = (y: number) => H - pad.b - ((y - yMin) / ((yMax - yMin) || 1)) * (H - pad.t - pad.b);

  const years = [xMin, Math.round((xMin + xMax) / 2), xMax];
  const gridYs = [0.25, 0.5, 0.75, 1].map((f) => yMin + f * (yMax - yMin));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      style={{ display: "block", overflow: "visible", ...style }}
      className={className}
    >
      {gridYs.map((gy, i) => (
        <line key={i} x1={pad.l} x2={W - pad.r} y1={py(gy)} y2={py(gy)} stroke="var(--border-subtle)" strokeWidth="1" />
      ))}
      {series.map((s, si) => {
        const c = s.color ?? colors[si % colors.length];
        const d = s.points.map((p, i) => `${i ? "L" : "M"}${px(p[0]).toFixed(1)} ${py(p[1]).toFixed(1)}`).join(" ");
        const area = `${d} L${px(s.points[s.points.length - 1][0]).toFixed(1)} ${py(0)} L${px(s.points[0][0]).toFixed(1)} ${py(0)} Z`;
        return (
          <g key={si}>
            {si === 0 && <path d={area} fill={c} opacity="0.08" />}
            <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((p, i) => (
              <circle key={i} cx={px(p[0])} cy={py(p[1])} r={i === s.points.length - 1 ? 4.5 : 2.5}
                fill="var(--surface-card)" stroke={c} strokeWidth="2" />
            ))}
          </g>
        );
      })}
      {years.map((yr) => (
        <text key={yr} x={px(yr)} y={H - 6} textAnchor="middle"
          fontFamily="var(--font-data)" fontSize="12" fill="var(--text-faint)">{yr}</text>
      ))}
    </svg>
  );
}
