"use client"

import { useDepartmentHeadcount } from "@/hooks/useInsights"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

export function DepartmentChart() {
  const { data, isLoading } = useDepartmentHeadcount()

  if (isLoading) return <div className="h-64 flex items-center justify-center text-gray-400">Loading…</div>

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Headcount by Department</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data ?? []} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="department" type="category" width={100} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="headcount" fill="#6366f1" name="Headcount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
