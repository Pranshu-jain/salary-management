require "rails_helper"

RSpec.describe Employee, type: :model do
  subject { build(:employee) }

  describe "validations" do
    it { should validate_presence_of(:full_name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:job_title) }
    it { should validate_presence_of(:department) }
    it { should validate_presence_of(:country) }
    it { should validate_presence_of(:salary) }
    it { should validate_presence_of(:hire_date) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_numericality_of(:salary).is_greater_than(0) }
    it { should validate_inclusion_of(:employment_status).in_array(Employee::EMPLOYMENT_STATUSES) }
  end

  describe "email normalization" do
    it "downcases email before save" do
      emp = create(:employee, email: "Test.User99@EXAMPLE.COM")
      expect(emp.email).to eq("test.user99@example.com")
    end
  end

  describe "scopes" do
    before do
      create(:employee, employment_status: "active",     country: "Germany")
      create(:employee, employment_status: "terminated", country: "Germany")
      create(:employee, employment_status: "active",     country: "India")
    end

    it ".active returns only active employees" do
      expect(Employee.active.count).to eq(2)
    end

    it ".by_country filters correctly" do
      expect(Employee.by_country("Germany").count).to eq(2)
    end
  end
end
