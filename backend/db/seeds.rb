BATCH_SIZE = 500

COUNTRIES = [
  "United States", "United Kingdom", "Germany", "France", "India",
  "Canada", "Australia", "Brazil", "Japan", "Netherlands",
  "Singapore", "Sweden", "Switzerland", "Spain", "Mexico"
].freeze

DEPARTMENTS = %w[Engineering Product Design Marketing Sales Finance HR Legal Operations].freeze

JOB_TITLES = {
  "Engineering"  => ["Software Engineer", "Senior Software Engineer", "Staff Engineer", "Engineering Manager", "DevOps Engineer", "QA Engineer"],
  "Product"      => ["Product Manager", "Senior Product Manager", "Director of Product", "Product Analyst"],
  "Design"       => ["UX Designer", "Senior UX Designer", "UI Designer", "Design Lead"],
  "Marketing"    => ["Marketing Manager", "Content Strategist", "SEO Specialist", "Growth Manager"],
  "Sales"        => ["Sales Representative", "Account Executive", "Sales Manager", "VP of Sales"],
  "Finance"      => ["Financial Analyst", "Senior Financial Analyst", "Finance Manager", "Controller"],
  "HR"           => ["HR Specialist", "HR Manager", "Recruiter", "People Operations Manager"],
  "Legal"        => ["Legal Counsel", "Senior Legal Counsel", "Paralegal", "Chief Legal Officer"],
  "Operations"   => ["Operations Analyst", "Operations Manager", "Business Analyst", "COO"]
}.freeze

SALARY_RANGES = {
  "Software Engineer"          => [70_000, 120_000],
  "Senior Software Engineer"   => [110_000, 170_000],
  "Staff Engineer"             => [160_000, 220_000],
  "Engineering Manager"        => [150_000, 200_000],
  "DevOps Engineer"            => [90_000, 140_000],
  "QA Engineer"                => [65_000, 110_000],
  "Product Manager"            => [95_000, 150_000],
  "Senior Product Manager"     => [140_000, 190_000],
  "Director of Product"        => [170_000, 230_000],
  "Product Analyst"            => [70_000, 110_000],
  "UX Designer"                => [75_000, 120_000],
  "Senior UX Designer"         => [110_000, 160_000],
  "UI Designer"                => [65_000, 110_000],
  "Design Lead"                => [130_000, 180_000],
  "Marketing Manager"          => [80_000, 130_000],
  "Content Strategist"         => [55_000, 90_000],
  "SEO Specialist"             => [50_000, 85_000],
  "Growth Manager"             => [85_000, 135_000],
  "Sales Representative"       => [50_000, 85_000],
  "Account Executive"          => [70_000, 120_000],
  "Sales Manager"              => [90_000, 140_000],
  "VP of Sales"                => [150_000, 220_000],
  "Financial Analyst"          => [65_000, 100_000],
  "Senior Financial Analyst"   => [95_000, 140_000],
  "Finance Manager"            => [110_000, 160_000],
  "Controller"                 => [130_000, 180_000],
  "HR Specialist"              => [50_000, 80_000],
  "HR Manager"                 => [80_000, 120_000],
  "Recruiter"                  => [55_000, 90_000],
  "People Operations Manager"  => [90_000, 130_000],
  "Legal Counsel"              => [100_000, 160_000],
  "Senior Legal Counsel"       => [150_000, 210_000],
  "Paralegal"                  => [50_000, 80_000],
  "Chief Legal Officer"        => [200_000, 300_000],
  "Operations Analyst"         => [55_000, 90_000],
  "Operations Manager"         => [90_000, 135_000],
  "Business Analyst"           => [65_000, 105_000],
  "COO"                        => [200_000, 320_000]
}.freeze

first_names = File.readlines(Rails.root.join("db/seeds_data/first_names.txt"), chomp: true)
last_names  = File.readlines(Rails.root.join("db/seeds_data/last_names.txt"),  chomp: true)

puts "Seeding 10,000 employees..."
start_time = Time.now

Employee.delete_all
ActiveRecord::Base.connection.reset_pk_sequence!("employees")

rng = Random.new(42)
now = Time.current.utc.strftime("%Y-%m-%d %H:%M:%S")

batch = []
10_000.times do |i|
  first      = first_names.sample(random: rng)
  last       = last_names.sample(random: rng)
  full_name  = "#{first} #{last}"
  email      = "#{first.downcase}.#{last.downcase}#{i + 1}@example.com"
  department = DEPARTMENTS.sample(random: rng)
  job_title  = JOB_TITLES[department].sample(random: rng)
  country    = COUNTRIES.sample(random: rng)
  range      = SALARY_RANGES[job_title]
  salary     = rng.rand(range[0]..range[1]).round(2)
  hire_date  = Date.today - rng.rand(30..3650)
  status     = rng.rand < 0.9 ? "active" : %w[inactive terminated].sample(random: rng)

  batch << {
    full_name: full_name, email: email, job_title: job_title,
    department: department, country: country, salary: salary,
    hire_date: hire_date, employment_status: status,
    created_at: now, updated_at: now
  }

  if batch.size >= BATCH_SIZE
    Employee.insert_all(batch)
    batch.clear
  end
end

Employee.insert_all(batch) if batch.any?

elapsed = (Time.now - start_time).round(2)
puts "Done. #{Employee.count} employees seeded in #{elapsed}s."
