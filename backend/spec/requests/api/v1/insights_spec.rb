require "rails_helper"

RSpec.describe "Api::V1::Insights", type: :request do
  before do
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 100_000, hire_date: 2.years.ago)
    create(:employee, country: "United States", job_title: "Software Engineer", department: "Engineering", salary: 120_000, hire_date: 6.months.ago)
    create(:employee, country: "Germany",       job_title: "Product Manager",   department: "Product",     salary: 90_000,  hire_date: 4.years.ago)
  end

  describe "GET /api/v1/insights/salary_by_country" do
    it "returns salary stats per country" do
      get "/api/v1/insights/salary_by_country"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      us = data.find { |d| d["country"] == "United States" }
      expect(us["min"]).to eq(100_000.0)
      expect(us["max"]).to eq(120_000.0)
      expect(us["avg"]).to eq(110_000.0)
      expect(us["headcount"]).to eq(2)
    end
  end

  describe "GET /api/v1/insights/salary_by_job_title" do
    it "returns salary stats per job title" do
      get "/api/v1/insights/salary_by_job_title"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data).to be_an(Array)
    end

    it "filters by country" do
      get "/api/v1/insights/salary_by_job_title", params: { country: "Germany" }
      data = JSON.parse(response.body)["data"]
      expect(data.all? { |d| d["country"] == "Germany" }).to be true
    end
  end

  describe "GET /api/v1/insights/department_headcount" do
    it "returns headcount and avg salary per department" do
      get "/api/v1/insights/department_headcount"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data.first).to include("department", "headcount", "avg_salary")
    end
  end

  describe "GET /api/v1/insights/tenure_bands" do
    it "returns tenure distribution" do
      get "/api/v1/insights/tenure_bands"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data).to be_an(Array)
    end
  end

  describe "GET /api/v1/insights/top_paying_titles" do
    it "returns top paying job titles" do
      get "/api/v1/insights/top_paying_titles"
      expect(response).to have_http_status(:ok)
      data = JSON.parse(response.body)["data"]
      expect(data.first["avg_salary"]).to be >= data.last["avg_salary"]
    end
  end
end
