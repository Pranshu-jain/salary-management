import { EmployeeTable } from "@/components/employees/employee-table"

export default function EmployeesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Employees</h1>
      <EmployeeTable />
    </div>
  )
}
