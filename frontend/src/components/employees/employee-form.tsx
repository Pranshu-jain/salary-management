"use client"

import { useState } from "react"
import type { Employee, EmployeeFormData } from "@/types/employee"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "Finance", "HR", "Legal", "Operations"]
const COUNTRIES = ["United States", "United Kingdom", "Germany", "France", "India", "Canada", "Australia", "Brazil", "Japan", "Netherlands", "Singapore", "Sweden", "Switzerland", "Spain", "Mexico"]
const STATUSES = ["active", "inactive", "terminated"]

interface Props {
  initial?: Employee
  onSubmit: (data: EmployeeFormData) => void
  loading?: boolean
}

export function EmployeeForm({ initial, onSubmit, loading }: Props) {
  const [form, setForm] = useState<EmployeeFormData>({
    full_name: initial?.full_name ?? "",
    email: initial?.email ?? "",
    job_title: initial?.job_title ?? "",
    department: initial?.department ?? "Engineering",
    country: initial?.country ?? "United States",
    salary: initial?.salary ?? "",
    hire_date: initial?.hire_date ?? "",
    employment_status: initial?.employment_status ?? "active",
  })

  const set = (k: keyof EmployeeFormData, v: string) => setForm((p) => ({ ...p, [k]: v }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {([
        ["full_name", "Full Name", "text"],
        ["email", "Email", "email"],
        ["job_title", "Job Title", "text"],
        ["salary", "Salary (USD)", "number"],
        ["hire_date", "Hire Date", "date"],
      ] as [keyof EmployeeFormData, string, string][]).map(([key, label, type]) => (
        <div key={key} className="space-y-1">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={type}
            value={form[key] as string}
            onChange={(e) => set(key, e.target.value)}
            required
            min={type === "number" ? 1 : undefined}
          />
        </div>
      ))}

      {([
        ["department", "Department", DEPARTMENTS],
        ["country", "Country", COUNTRIES],
        ["employment_status", "Status", STATUSES],
      ] as [keyof EmployeeFormData, string, string[]][]).map(([key, label, options]) => (
        <div key={key} className="space-y-1">
          <Label htmlFor={key}>{label}</Label>
          <select
            id={key}
            value={form[key] as string}
            onChange={(e) => set(key, e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            {options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving…" : initial ? "Update Employee" : "Create Employee"}
        </Button>
      </div>
    </form>
  )
}
