"use client"

import { useSalaryByCountry } from "@/hooks/useInsights"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"

export function SalaryByCountryChart() {
  const { data, isLoading } = useSalaryByCountry()

  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>

  const formatted = (data ?? []).map((d) => ({
    ...d,
    min: Math.round(d.min),
    max: Math.round(d.max),
    avg: Math.round(d.avg),
  }))

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Salary by Country (Min / Avg / Max)</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={formatted} margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={70} />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
          <Legend />
          <Bar dataKey="min" fill="#93c5fd" name="Min" />
          <Bar dataKey="avg" fill="#3b82f6" name="Avg" />
          <Bar dataKey="max" fill="#1d4ed8" name="Max" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
