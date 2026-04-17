import Link from "next/link"

export default function Home() {
  return (
    <div className="mt-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Salary Management</h1>
      <p className="mt-3 text-lg text-gray-500">HR platform for managing 10,000+ employees</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/employees"
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Manage Employees
        </Link>
        <Link
          href="/insights"
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow hover:bg-gray-50"
        >
          View Insights
        </Link>
      </div>
    </div>
  )
}
