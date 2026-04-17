"use client"

import { useState } from "react"
import { useEmployees, useDeleteEmployee } from "@/hooks/useEmployees"
import { EmployeeDialog } from "./employee-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import type { Employee, EmployeeFilters } from "@/types/employee"

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-yellow-100 text-yellow-800",
  terminated: "bg-red-100 text-red-800",
}

export function EmployeeTable() {
  const [filters, setFilters] = useState<EmployeeFilters>({ page: 1, per_page: 25 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Employee | undefined>()

  const { data, isLoading } = useEmployees(filters)
  const deleteEmployee = useDeleteEmployee()

  const setFilter = (k: keyof EmployeeFilters, v: string | number) =>
    setFilters((p) => ({ ...p, [k]: v, page: 1 }))

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee?")) return
    await deleteEmployee.mutateAsync(id)
  }

  const openCreate = () => { setEditing(undefined); setDialogOpen(true) }
  const openEdit = (emp: Employee) => { setEditing(emp); setDialogOpen(true) }

  const total = data?.meta.total ?? 0
  const page = filters.page ?? 1
  const perPage = filters.per_page ?? 25
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Search name…"
            className="w-48"
            onChange={(e) => setFilter("search", e.target.value)}
          />
          <Input
            placeholder="Country…"
            className="w-36"
            onChange={(e) => setFilter("country", e.target.value)}
          />
          <Input
            placeholder="Department…"
            className="w-36"
            onChange={(e) => setFilter("department", e.target.value)}
          />
        </div>
        <Button onClick={openCreate}>+ Add Employee</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Name", "Job Title", "Department", "Country", "Salary", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
            ) : data?.employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{emp.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{emp.job_title}</td>
                <td className="px-4 py-3 text-gray-600">{emp.department}</td>
                <td className="px-4 py-3 text-gray-600">{emp.country}</td>
                <td className="px-4 py-3 text-gray-900">${Number(emp.salary).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[emp.employment_status]}`}>
                    {emp.employment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(emp)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(emp.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{total.toLocaleString()} employees total</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setFilter("page", page - 1)}>Previous</Button>
          <span className="self-center">Page {page} of {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setFilter("page", page + 1)}>Next</Button>
        </div>
      </div>

      <EmployeeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} employee={editing} />
    </div>
  )
}
