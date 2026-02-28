"use client";

interface Props {
  value: number; // 0-100
  size?: number;
}

export function ProgressRing({ value, size = 72 }: Props) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#E8E4E4" strokeWidth={6}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={value === 100 ? "#FEB05D" : "#5A7ACD"}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  );
}
