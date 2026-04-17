import Link from "next/link"

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-bold text-gray-900">
            SalaryHQ
          </Link>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/employees" className="hover:text-gray-900">Employees</Link>
            <Link href="/insights" className="hover:text-gray-900">Insights</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
