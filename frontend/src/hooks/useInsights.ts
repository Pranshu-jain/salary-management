"use client"

import { useQuery } from "@tanstack/react-query"
import { insightsApi } from "@/lib/api"

export function useSalaryByCountry() {
  return useQuery({ queryKey: ["insights", "salary_by_country"], queryFn: insightsApi.salaryByCountry })
}

export function useSalaryByJobTitle(country?: string) {
  return useQuery({ queryKey: ["insights", "salary_by_job_title", country], queryFn: () => insightsApi.salaryByJobTitle(country) })
}

export function useDepartmentHeadcount() {
  return useQuery({ queryKey: ["insights", "department_headcount"], queryFn: insightsApi.departmentHeadcount })
}

export function useTenureBands() {
  return useQuery({ queryKey: ["insights", "tenure_bands"], queryFn: insightsApi.tenureBands })
}

export function useTopPayingTitles(limit = 10) {
  return useQuery({ queryKey: ["insights", "top_paying_titles", limit], queryFn: () => insightsApi.topPayingTitles(limit) })
}
