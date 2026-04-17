# Salary Management System

A production-quality, full-stack salary management platform built for HR managers to manage 10,000+ employees and derive compensation insights.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Features](#features)
- [Getting Started](#getting-started)
- [Running the Project](#running-the-project)
- [Running Tests](#running-tests)
- [Seed Data](#seed-data)
- [Design Decisions](#design-decisions)
- [Performance Considerations](#performance-considerations)

---

## Overview

This system allows HR managers to:

- **Manage employees** — create, view, update, and delete employee records across departments, countries, and job titles
- **Derive salary insights** — visualize compensation data through 5 analytical views: salary by country, salary by job title, department headcount, tenure distribution, and top-paying roles

Built to handle 10,000+ employees with fast queries, clean architecture, and a maintainable codebase.

---

## Architecture

```
salary-management/
├── backend/       # Rails 7.1 API (JSON only, no views)
└── frontend/      # Next.js 16 (React, TypeScript, Tailwind)
```

```
Browser (Next.js :3001)
        │
        │  HTTP/JSON
        ▼
Rails API (:3000)
        │
        │  ActiveRecord
        ▼
PostgreSQL (salary_management_development)
```

The backend is a pure API — no session, no HTML. The frontend is fully decoupled and communicates via REST. CORS is configured to allow requests from the frontend origin.

---

## Tech Stack

### Backend
| | |
|---|---|
| Framework | Ruby on Rails 7.1 (API mode) |
| Language | Ruby 3.0 |
| Database | PostgreSQL 14 |
| Pagination | Kaminari |
| Testing | RSpec, FactoryBot, Shoulda-matchers, Faker |

### Frontend
| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Data Fetching | TanStack Query v5 |
| Charts | Recharts |
| HTTP Client | Axios |

---

## Project Structure

```
backend/
├── app/
│   ├── controllers/
│   │   ├── api/v1/
│   │   │   ├── employees_controller.rb       # CRUD with pagination/search/filter
│   │   │   └── insights/
│   │   │       ├── salary_by_country_controller.rb
│   │   │       ├── salary_by_job_title_controller.rb
│   │   │       ├── department_headcount_controller.rb
│   │   │       ├── tenure_bands_controller.rb
│   │   │       └── top_paying_titles_controller.rb
│   └── models/
│       └── employee.rb                       # Validations, scopes, email normalization
├── db/
│   ├── migrate/                              # Schema with indexes
│   ├── seeds.rb                              # Bulk seed: 10k employees in ~2.4s
│   └── seeds_data/
│       ├── first_names.txt
│       └── last_names.txt
└── spec/
    ├── models/employee_spec.rb               # 13 model tests
    └── requests/api/v1/
        ├── employees_spec.rb                 # 8 CRUD tests
        └── insights_spec.rb                  # 7 insights tests

frontend/
├── src/
│   ├── app/
│   │   ├── employees/page.tsx               # Employee list page
│   │   └── insights/page.tsx                # Insights dashboard
│   ├── components/
│   │   ├── employees/
│   │   │   ├── employee-table.tsx           # Paginated table with search/filter
│   │   │   ├── employee-dialog.tsx          # Create/edit modal
│   │   │   └── employee-form.tsx            # Shared form (create + edit)
│   │   └── insights/
│   │       ├── salary-country-chart.tsx     # Bar chart — min/avg/max by country
│   │       ├── department-chart.tsx         # Horizontal bar — headcount by dept
│   │       ├── tenure-chart.tsx             # Pie chart — tenure bands
│   │       └── top-titles-table.tsx         # Ranked table — top paying titles
│   ├── hooks/
│   │   ├── useEmployees.ts                  # CRUD query/mutation hooks
│   │   └── useInsights.ts                   # Insights query hooks
│   ├── lib/
│   │   ├── api.ts                           # Axios API client (typed)
│   │   └── query-client.ts                  # TanStack QueryClient config
│   └── types/
│       └── employee.ts                      # All TypeScript domain types
```

---

## Database Schema

```sql
CREATE TABLE employees (
  id                 SERIAL PRIMARY KEY,
  full_name          VARCHAR       NOT NULL,
  email              VARCHAR       NOT NULL UNIQUE,
  job_title          VARCHAR       NOT NULL,
  department         VARCHAR       NOT NULL,
  country            VARCHAR       NOT NULL,
  salary             DECIMAL(12,2) NOT NULL,
  hire_date          DATE          NOT NULL,
  employment_status  VARCHAR       NOT NULL DEFAULT 'active',
  created_at         TIMESTAMP     NOT NULL,
  updated_at         TIMESTAMP     NOT NULL
);

-- Indexes
CREATE UNIQUE INDEX ON employees (email);
CREATE INDEX ON employees (country);
CREATE INDEX ON employees (job_title);
CREATE INDEX ON employees (department);
CREATE INDEX ON employees (country, job_title);   -- composite for filtered insights
CREATE INDEX ON employees (salary);
```

**Why `DECIMAL(12,2)` for salary?** Avoids floating-point precision errors. Supports salaries up to $9.9 billion.

---

## API Reference

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/employees` | List employees (paginated) |
| POST | `/api/v1/employees` | Create employee |
| GET | `/api/v1/employees/:id` | Get employee |
| PUT | `/api/v1/employees/:id` | Update employee |
| DELETE | `/api/v1/employees/:id` | Delete employee |

**Query params for GET /employees:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Case-insensitive name search (ILIKE) |
| `country` | string | Case-insensitive country filter |
| `department` | string | Case-insensitive department filter |
| `status` | string | Filter by employment_status |
| `page` | integer | Page number (default: 1) |
| `per_page` | integer | Records per page (default: 25) |
| `sort` | string | Column to sort by (full_name, salary, hire_date, etc.) |
| `dir` | string | `asc` or `desc` |

**Response:**
```json
{
  "employees": [...],
  "meta": { "total": 10000, "page": 1, "per_page": 25 }
}
```

### Insights

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/insights/salary_by_country` | Min/avg/max salary + headcount per country |
| GET | `/api/v1/insights/salary_by_job_title` | Salary stats per job title (optional `?country=`) |
| GET | `/api/v1/insights/department_headcount` | Headcount + avg salary per department |
| GET | `/api/v1/insights/tenure_bands` | Employee count bucketed into tenure bands |
| GET | `/api/v1/insights/top_paying_titles` | Top paying job titles by avg salary (`?limit=10`) |

---

## Features

### Employee Management
- Full CRUD via a paginated, searchable, filterable table
- Case-insensitive search by name, filter by country / department / status
- Create and edit employees via a modal form with dropdown validation
- Confirm before delete to prevent accidental data loss

### Salary Insights
1. **Salary by Country** — grouped bar chart showing min, avg, max salary per country. Surfaces geographic compensation gaps.
2. **Department Headcount** — horizontal bar chart of employee count + avg salary per department. Useful for org planning.
3. **Tenure Distribution** — pie chart bucketing employees into 0-1y, 1-3y, 3-5y, and 5+ year bands. Key leading indicator for attrition risk.
4. **Top Paying Job Titles** — ranked table of the 10 highest avg-salary roles. Essential for comp benchmarking.

---

## Getting Started

### Prerequisites

- Ruby 3.0+
- Rails 7.1+
- PostgreSQL 14+
- Node.js 20+ (use nvm: `nvm use 20`)
- npm 10+

### 1. Clone the repo

```bash
git clone https://github.com/Pranshu-jain/salary-management.git
cd salary-management
```

### 2. Backend setup

```bash
cd backend
bundle install

# Create DB user (if not exists)
psql -d postgres -c "CREATE USER salary_management WITH SUPERUSER PASSWORD 'password';"

# Create and migrate databases
rails db:create db:migrate

# Seed 10,000 employees (~2.4s)
rails db:seed
```

### 3. Frontend setup

```bash
cd frontend
nvm use 20
npm install
```

Create a `.env.local` file inside `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## Running the Project

Start both servers in separate terminals:

```bash
# Terminal 1 — Rails API
cd backend
rails server -p 3000

# Terminal 2 — Next.js UI
cd frontend
source ~/.nvm/nvm.sh && nvm use 20
npm run dev -- --port 3001
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:3000/api/v1 |
| Rails health | http://localhost:3000/up |

---

## Running Tests

```bash
cd backend
bundle exec rspec --format documentation
```

**28 tests, 0 failures:**

```
Employee
  validations (10 examples)
  email normalization (1 example)
  scopes (2 examples)

Api::V1::Employees
  GET /api/v1/employees (3 examples)
  GET /api/v1/employees/:id (2 examples)
  POST /api/v1/employees (2 examples)
  PUT /api/v1/employees/:id (1 example)
  DELETE /api/v1/employees/:id (1 example)

Api::V1::Insights
  salary_by_country (1 example)
  salary_by_job_title (2 examples)
  department_headcount (1 example)
  tenure_bands (1 example)
  top_paying_titles (1 example)
```

---

## Seed Data

The seed script generates 10,000 realistic employees in ~2.4 seconds.

**How it works:**
- Names combined from `first_names.txt` (130 names) × `last_names.txt` (140 names)
- Realistic salary ranges per job title (e.g. Staff Engineer: $160k–$220k)
- 15 countries, 9 departments, 39 job titles
- 90% active / 10% inactive or terminated
- Hire dates spread over the past 10 years
- Fixed random seed (`Random.new(42)`) — deterministic and reproducible

**Re-run safely:**
```bash
rails db:seed   # truncates and re-seeds — safe to run multiple times
```

---

## Design Decisions

### Why Rails API mode?
Keeps the backend a clean, stateless JSON service. No views, no asset pipeline, no sessions. The frontend is fully decoupled and can be deployed independently.

### Why PostgreSQL over SQLite?
- `ILIKE` for case-insensitive search across all filter fields
- Composite indexes for multi-column aggregations
- `DECIMAL` type for precise currency storage
- Production-grade concurrency and connection pooling

### Why TanStack Query?
- Automatic caching with configurable stale time (2 min)
- `invalidateQueries` keeps the employee table fresh after any mutation — zero manual state sync

### Why shadcn/ui over MUI?
- Components are copied into the project — no version lock-in
- Zero runtime CSS-in-JS overhead
- Fully accessible (Radix UI primitives)

### Why bulk `insert_all` for seeding?
A loop with `Employee.create!` fires 10,000 individual `INSERT` statements. `insert_all` in batches of 500 reduces that to 20 statements — ~4x faster.

---

## Performance Considerations

| Concern | Solution |
|---------|----------|
| Slow list queries on 10k rows | Pagination (25/page), indexed columns |
| N+1 on insights | All aggregations in a single SQL `GROUP BY` |
| Repeated insight fetches | TanStack Query caches for 2 minutes |
| Slow seed execution | `insert_all` in batches of 500 (~2.4s for 10k rows) |
| Case-insensitive search cost | PostgreSQL `ILIKE` on all filter fields |
| Large JSON payloads | `per_page` default of 25; only required fields serialized |
