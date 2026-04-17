import { SalaryByCountryChart } from "@/components/insights/salary-country-chart"
import { DepartmentChart } from "@/components/insights/department-chart"
import { TenureChart } from "@/components/insights/tenure-chart"
import { TopTitlesTable } from "@/components/insights/top-titles-table"

export default function InsightsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Salary Insights</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <SalaryByCountryChart />
        </div>
        <DepartmentChart />
        <TenureChart />
        <div className="lg:col-span-2">
          <TopTitlesTable />
        </div>
      </div>
    </div>
  )
}
