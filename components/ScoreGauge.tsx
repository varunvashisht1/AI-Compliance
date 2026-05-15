"use client";

export function ScoreGauge({
  label,
  value,
  size = 80,
}: {
  label: string;
  value: number | null;
  size?: number;
}) {
  const display = value === null || value === undefined ? "—" : String(value);
  const score = typeof value === "number" ? value : 0;
  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const color =
    value === null
      ? "#cbd5e1"
      : value >= 90
      ? "#059669"
      : value >= 70
      ? "#d97706"
      : value >= 50
      ? "#ea580c"
      : "#dc2626";

  return (
    <div className="card flex flex-col items-center justify-center p-4 text-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-label={`${label} score: ${display} out of 100`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="6"
          fill="none"
        />
        {value !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 700ms ease-out" }}
          />
        )}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-900"
          style={{ fontSize: size / 3.4, fontWeight: 700 }}
        >
          {display}
        </text>
      </svg>
      <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </div>
    </div>
  );
}
