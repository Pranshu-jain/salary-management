import axios from "axios"
import type {
  Employee,
  EmployeeFilters,
  EmployeeFormData,
  PaginatedEmployees,
  SalaryByCountry,
  SalaryByJobTitle,
  DepartmentHeadcount,
  TenureBand,
  TopPayingTitle,
} from "@/types/employee"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
})

export const employeesApi = {
  list: (filters: EmployeeFilters = {}) =>
    api.get<PaginatedEmployees>("/employees", { params: filters }).then((r) => r.data),

  get: (id: number) =>
    api.get<Employee>(`/employees/${id}`).then((r) => r.data),

  create: (data: EmployeeFormData) =>
    api.post<Employee>("/employees", { employee: data }).then((r) => r.data),

  update: (id: number, data: Partial<EmployeeFormData>) =>
    api.put<Employee>(`/employees/${id}`, { employee: data }).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/employees/${id}`),
}

export const insightsApi = {
  salaryByCountry: () =>
    api.get<{ data: SalaryByCountry[] }>("/insights/salary_by_country").then((r) => r.data.data),

  salaryByJobTitle: (country?: string) =>
    api.get<{ data: SalaryByJobTitle[] }>("/insights/salary_by_job_title", { params: { country } }).then((r) => r.data.data),

  departmentHeadcount: () =>
    api.get<{ data: DepartmentHeadcount[] }>("/insights/department_headcount").then((r) => r.data.data),

  tenureBands: () =>
    api.get<{ data: TenureBand[] }>("/insights/tenure_bands").then((r) => r.data.data),

  topPayingTitles: (limit = 10) =>
    api.get<{ data: TopPayingTitle[] }>("/insights/top_paying_titles", { params: { limit } }).then((r) => r.data.data),
}
