"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employeesApi } from "@/lib/api"
import type { EmployeeFilters, EmployeeFormData } from "@/types/employee"

export const EMPLOYEES_KEY = "employees"

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, filters],
    queryFn: () => employeesApi.list(filters),
  })
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: [EMPLOYEES_KEY, id],
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EmployeeFormData) => employeesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}

export function useUpdateEmployee(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<EmployeeFormData>) => employeesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => employeesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [EMPLOYEES_KEY] }),
  })
}
