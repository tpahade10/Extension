import { useMemo, useState } from "react";

interface FunnelStage {
  name: string;
  value: number;
  color: string;
}

const applicationFunnelData: FunnelStage[] = [
  { name: "Applied", value: 286, color: "hsl(var(--chart-blue))" },
  { name: "Screened", value: 189, color: "hsl(var(--chart-cyan))" },
  { name: "Interviewing", value: 69, color: "hsl(var(--chart-purple))" },
  { name: "Accepted", value: 8, color: "hsl(var(--chart-green))" },
];

export default function ApplicationFunnel() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const height = 320;

  const chartData = useMemo(() => {
    const maxValue = Math.max(...applicationFunnelData.map((d) => d.value));
    const minWidth = 35;
    const maxWidth = 100;

    return applicationFunnelData.map((stage, index) => {
      const widthPercent = minWidth + (stage.value / maxValue) * (maxWidth - minWidth);
      return {
        ...stage,
        widthPercent,
      };
    });
  }, []);

  return (
    <div
      className="bg-card border border-border rounded-xl p-6 shadow-card animate-slide-up"
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Application Funnel</h3>
          <p className="text-sm text-muted-foreground">Candidate progression flow</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-secondary rounded-md">2025</span>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {/* Background Grid */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Funnel Stages */}
        <svg className="relative w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            {chartData.map((stage, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`funnel-gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={stage.color} stopOpacity="0.9" />
                <stop offset="50%" stopColor={stage.color} stopOpacity="1" />
                <stop offset="100%" stopColor={stage.color} stopOpacity="0.9" />
              </linearGradient>
            ))}
          </defs>

          {chartData.map((stage, index) => {
            const y = (index / chartData.length) * 100;
            const nextY = ((index + 1) / chartData.length) * 100;
            const nextWidth =
              index < chartData.length - 1
                ? chartData[index + 1].widthPercent
                : stage.widthPercent * 0.7;

            const leftMargin = (100 - stage.widthPercent) / 2;
            const nextLeftMargin = (100 - nextWidth) / 2;

            const path = `
              M ${leftMargin} ${y}
              L ${leftMargin + stage.widthPercent} ${y}
              L ${nextLeftMargin + nextWidth} ${nextY}
              L ${nextLeftMargin} ${nextY}
              Z
            `;

            return (
              <g key={stage.name}>
                <path
                  d={path}
                  fill={`url(#funnel-gradient-${index})`}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: hoveredIndex === index ? "brightness(1.2)" : "brightness(1)",
                    transform: hoveredIndex === index ? "scaleX(1.02)" : "scaleX(1)",
                    transformOrigin: "center",
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                <path
                  d={path}
                  fill="none"
                  stroke="hsl(var(--background))"
                  strokeWidth="0.3"
                  strokeOpacity="0.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Labels Overlay */}
        {chartData.map((stage, index) => {
          const yPosition = (index / chartData.length) * 100 + 100 / chartData.length / 2;
          const topOffset = (yPosition / 100) * height;

          return (
            <div
              key={`label-${stage.name}`}
              className="absolute left-0 right-0 flex items-center justify-between px-4 pointer-events-none"
              style={{
                top: `${topOffset}px`,
                transform: "translateY(-50%)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-sm font-medium text-foreground drop-shadow-sm">
                  {stage.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground drop-shadow-sm">
                  {stage.value}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({((stage.value / chartData[0].value) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Footer */}
      <div className="mt-6 pt-4 border-t border-border grid grid-cols-4 gap-4">
        {chartData.map((stage, index) => (
          <div
            key={`stat-${stage.name}`}
            className="text-center p-2 rounded-lg transition-all duration-200 hover:bg-secondary/50 cursor-pointer"
          >
            <div
              className="w-full h-1 rounded-full mb-2"
              style={{ backgroundColor: stage.color }}
            />
            <p className="text-xs text-muted-foreground">{stage.name}</p>
            <p className="text-sm font-bold text-foreground">{stage.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
