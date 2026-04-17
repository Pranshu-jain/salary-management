export interface Employee {
  id: number
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: number
  hire_date: string
  employment_status: "active" | "inactive" | "terminated"
  created_at: string
  updated_at: string
}

export interface EmployeeFormData {
  full_name: string
  email: string
  job_title: string
  department: string
  country: string
  salary: number | string
  hire_date: string
  employment_status: string
}

export interface PaginatedEmployees {
  employees: Employee[]
  meta: {
    total: number
    page: number
    per_page: number
  }
}

export interface EmployeeFilters {
  search?: string
  country?: string
  department?: string
  status?: string
  page?: number
  per_page?: number
  sort?: string
  dir?: string
}

export interface SalaryByCountry {
  country: string
  min: number
  max: number
  avg: number
  headcount: number
}

export interface SalaryByJobTitle {
  job_title: string
  country: string
  min: number
  max: number
  avg: number
  headcount: number
}

export interface DepartmentHeadcount {
  department: string
  headcount: number
  avg_salary: number
}

export interface TenureBand {
  band: string
  headcount: number
  avg_salary: number
}

export interface TopPayingTitle {
  job_title: string
  avg_salary: number
  headcount: number
}
