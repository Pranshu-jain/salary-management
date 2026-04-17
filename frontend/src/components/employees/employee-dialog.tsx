"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmployeeForm } from "./employee-form"
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees"
import type { Employee, EmployeeFormData } from "@/types/employee"

interface Props {
  open: boolean
  onClose: () => void
  employee?: Employee
}

export function EmployeeDialog({ open, onClose, employee }: Props) {
  const create = useCreateEmployee()
  const update = useUpdateEmployee(employee?.id ?? 0)

  const handleSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        await update.mutateAsync(data)
      } else {
        await create.mutateAsync(data)
      }
      onClose()
    } catch {
      // errors surfaced by react-query
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{employee ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>
        <EmployeeForm
          initial={employee}
          onSubmit={handleSubmit}
          loading={create.isPending || update.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
