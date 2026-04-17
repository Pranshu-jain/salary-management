"use client"

import { useTopPayingTitles } from "@/hooks/useInsights"

export function TopTitlesTable() {
  const { data, isLoading } = useTopPayingTitles(10)

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Top 10 Paying Job Titles</h3>
      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2">Title</th>
              <th className="pb-2 text-right">Avg Salary</th>
              <th className="pb-2 text-right">Headcount</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row, i) => (
              <tr key={row.job_title} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 font-medium text-gray-800">
                  <span className="mr-2 text-gray-400">#{i + 1}</span>
                  {row.job_title}
                </td>
                <td className="py-2 text-right text-green-700">${Math.round(row.avg_salary).toLocaleString()}</td>
                <td className="py-2 text-right text-gray-600">{row.headcount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
