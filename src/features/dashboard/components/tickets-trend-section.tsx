"use client";

import { useId } from "react";

import { useAnalyticsOverview } from "../hooks";
import type { DashboardPeriodCount } from "../types/dashboard.types";
import { DashboardCard } from "./dashboard-card";
import { formatNumber, formatPeriodLabel } from "./format";

const VIEW_W = 100;
const VIEW_H = 40;
const PAD_Y = 4;

interface ChartGeometry {
  linePoints: string;
  areaPath: string;
  dots: { x: number; y: number }[];
}

function buildGeometry(series: DashboardPeriodCount[]): ChartGeometry {
  const max = Math.max(1, ...series.map((point) => point.count));
  const lastIndex = Math.max(1, series.length - 1);

  const coords = series.map((point, index) => {
    const x = series.length === 1 ? VIEW_W / 2 : (index / lastIndex) * VIEW_W;
    const usableHeight = VIEW_H - PAD_Y * 2;
    const y = VIEW_H - PAD_Y - (point.count / max) * usableHeight;
    return { x, y };
  });

  const linePoints = coords.map(({ x, y }) => `${x},${y}`).join(" ");
  const first = coords[0];
  const last = coords[coords.length - 1];
  const areaPath = `M ${first.x},${VIEW_H} L ${linePoints
    .split(" ")
    .join(" L ")} L ${last.x},${VIEW_H} Z`;

  return { linePoints, areaPath, dots: coords };
}

export function TicketsTrendSection() {
  const gradientId = useId();
  const { data, isLoading, isError, error, refetch } = useAnalyticsOverview();

  const series = data?.ticketsCreatedByPeriod ?? [];
  const geometry = series.length > 0 ? buildGeometry(series) : null;
  const totalCreated = series.reduce((sum, point) => sum + point.count, 0);

  return (
    <DashboardCard
      title="Visão geral de chamados"
      action={
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2.5 rounded-full bg-primary" />
          Chamados criados
        </span>
      }
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={series.length === 0}
      emptyDescription="Sem histórico de chamados criados no período."
      onRetry={() => refetch()}
    >
      {geometry ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-heading text-2xl font-semibold text-foreground">
              {formatNumber(totalCreated)}
            </span>{" "}
            chamados no período
          </p>

          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="none"
            className="h-40 w-full"
            role="img"
            aria-label="Tendência de chamados criados por período"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--primary)"
                  stopOpacity="0.25"
                />
                <stop
                  offset="100%"
                  stopColor="var(--primary)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            <path d={geometry.areaPath} fill={`url(#${gradientId})`} />
            <polyline
              points={geometry.linePoints}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPeriodLabel(series[0].period)}</span>
            {series.length > 2 ? (
              <span>
                {formatPeriodLabel(
                  series[Math.floor(series.length / 2)].period,
                )}
              </span>
            ) : null}
            <span>{formatPeriodLabel(series[series.length - 1].period)}</span>
          </div>
        </div>
      ) : null}
    </DashboardCard>
  );
}
