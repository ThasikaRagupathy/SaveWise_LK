"use client";

import React from "react";
import { formatLKR } from "@/lib/currency";

export interface TrendPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

export interface MonthlyTrendChartProps {
  points: TrendPoint[];
  title?: string;
  secondaryLabel?: string;
  primaryLabel?: string;
}

export function MonthlyTrendChart({
  points,
  secondaryLabel = "Accelerated",
  primaryLabel = "Baseline",
}: MonthlyTrendChartProps) {
  if (!points || points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-charcoal-muted dark:text-charcoal-darkMuted">
        No projection points available.
      </div>
    );
  }

  const values = points.map((p) => p.value);
  const secValues = points.map((p) => p.secondaryValue ?? p.value);
  const allValues = [...values, ...secValues];
  const maxVal = Math.max(...allValues, 1000);
  const minVal = Math.min(...allValues, 0);

  const width = 600;
  const height = 200;
  const paddingX = 40;
  const paddingY = 25;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const getCoordinates = (val: number, index: number) => {
    const x = paddingX + (index / (points.length - 1)) * chartW;
    const norm = (val - minVal) / (maxVal - minVal || 1);
    const y = height - paddingY - norm * chartH;
    return { x, y };
  };

  const primaryCoords = points.map((p, i) => getCoordinates(p.value, i));
  const primaryPath = primaryCoords.reduce(
    (acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`),
    ""
  );

  const secCoords = points.map((p, i) => getCoordinates(p.secondaryValue ?? p.value, i));
  const secPath = secCoords.reduce(
    (acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`),
    ""
  );

  return (
    <div className="w-full space-y-3">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1.5 rounded-full bg-brand-500" />
          <span className="text-charcoal dark:text-charcoal-dark font-medium">{primaryLabel}</span>
        </div>
        {points[0].secondaryValue !== undefined && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-charcoal dark:text-charcoal-dark font-medium">{secondaryLabel}</span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible font-sans"
        >
          <defs>
            <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#299E72" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#299E72" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="secGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-surface-border dark:text-surface-darkBorder"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="currentColor"
            strokeDasharray="4 4"
            className="text-surface-border dark:text-surface-darkBorder"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="currentColor"
            className="text-surface-border dark:text-surface-darkBorder"
          />

          {/* Secondary Area & Line (if available) */}
          {points[0].secondaryValue !== undefined && (
            <>
              <path
                d={`${secPath} L ${secCoords[secCoords.length - 1].x} ${
                  height - paddingY
                } L ${secCoords[0].x} ${height - paddingY} Z`}
                fill="url(#secGrad)"
              />
              <path
                d={secPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
            </>
          )}

          {/* Primary Area & Line */}
          <path
            d={`${primaryPath} L ${primaryCoords[primaryCoords.length - 1].x} ${
              height - paddingY
            } L ${primaryCoords[0].x} ${height - paddingY} Z`}
            fill="url(#primaryGrad)"
          />
          <path d={primaryPath} fill="none" stroke="#299E72" strokeWidth="2.5" />

          {/* Points */}
          {primaryCoords.map((c, i) => (
            <circle
              key={`p-${i}`}
              cx={c.x}
              cy={c.y}
              r="4"
              className="fill-white dark:fill-surface-darkCard stroke-brand-600 stroke-[2]"
            />
          ))}

          {/* Labels */}
          {points.map((p, i) => {
            const x = paddingX + (i / (points.length - 1)) * chartW;
            return (
              <text
                key={`label-${i}`}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[10px] fill-charcoal-muted dark:fill-charcoal-darkMuted"
              >
                {p.label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Quick summary below */}
      <div className="flex items-center justify-between text-xs text-charcoal-muted dark:text-charcoal-darkMuted pt-1">
        <span>Initial: {formatLKR(points[0].value)}</span>
        <span>
          Projected:{" "}
          <strong className="text-brand-600 dark:text-brand-400 font-mono">
            {formatLKR(points[points.length - 1].secondaryValue ?? points[points.length - 1].value)}
          </strong>
        </span>
      </div>
    </div>
  );
}
