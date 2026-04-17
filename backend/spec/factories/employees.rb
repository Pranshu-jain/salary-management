FactoryBot.define do
  factory :employee do
    sequence(:full_name) { |n| "#{Faker::Name.first_name} #{Faker::Name.last_name} #{n}" }
    sequence(:email)     { |n| "employee#{n}@example.com" }
    job_title            { ["Software Engineer", "Product Manager", "HR Specialist"].sample }
    department           { ["Engineering", "Product", "HR"].sample }
    country              { ["United States", "Germany", "India"].sample }
    salary               { rand(50_000..200_000) }
    hire_date            { Faker::Date.between(from: 5.years.ago, to: Date.today) }
    employment_status    { "active" }
  end
end
