require "rails_helper"

RSpec.describe "Api::V1::Employees", type: :request do
  let!(:employees) { create_list(:employee, 3, country: "United States") }
  let(:employee)   { employees.first }

  describe "GET /api/v1/employees" do
    it "returns paginated employees" do
      get "/api/v1/employees"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["employees"]).to be_an(Array)
      expect(json["meta"]["total"]).to eq(3)
    end

    it "filters by country" do
      create(:employee, country: "Germany")
      get "/api/v1/employees", params: { country: "Germany" }
      json = JSON.parse(response.body)
      expect(json["meta"]["total"]).to eq(1)
    end

    it "searches by name" do
      target = create(:employee, full_name: "Unique Searchname 9999")
      get "/api/v1/employees", params: { search: "Searchname" }
      json = JSON.parse(response.body)
      expect(json["employees"].map { |e| e["id"] }).to include(target.id)
    end
  end

  describe "GET /api/v1/employees/:id" do
    it "returns the employee" do
      get "/api/v1/employees/#{employee.id}"
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["id"]).to eq(employee.id)
    end

    it "returns 404 for missing employee" do
      get "/api/v1/employees/9999999"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/employees" do
    let(:valid_params) do
      {
        employee: {
          full_name: "Jane Doe", email: "jane.doe@example.com",
          job_title: "Software Engineer", department: "Engineering",
          country: "United States", salary: 120_000,
          hire_date: "2023-01-15", employment_status: "active"
        }
      }
    end

    it "creates an employee" do
      expect {
        post "/api/v1/employees", params: valid_params
      }.to change(Employee, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it "returns errors for invalid data" do
      post "/api/v1/employees", params: { employee: { full_name: "" } }
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)["errors"]).to be_present
    end
  end

  describe "PUT /api/v1/employees/:id" do
    it "updates the employee" do
      put "/api/v1/employees/#{employee.id}", params: { employee: { salary: 999_999 } }
      expect(response).to have_http_status(:ok)
      expect(employee.reload.salary.to_f).to eq(999_999.0)
    end
  end

  describe "DELETE /api/v1/employees/:id" do
    it "destroys the employee" do
      expect {
        delete "/api/v1/employees/#{employee.id}"
      }.to change(Employee, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end
  end
end
