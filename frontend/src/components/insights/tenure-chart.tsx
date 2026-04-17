"use client"

import { useTenureBands } from "@/hooks/useInsights"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"]

export function TenureChart() {
  const { data, isLoading } = useTenureBands()

  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Tenure Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data ?? []} dataKey="headcount" nameKey="band" cx="50%" cy="50%" outerRadius={90} label={(entry) => `${entry.name}: ${entry.value}`}>
            {(data ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
