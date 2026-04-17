module Api
  module V1
    module Insights
      # Insight: department size + avg salary — helps HR spot overstaffed/underpaid depts
      class DepartmentHeadcountController < InsightsController
        def show
          data = Employee
            .select("department, COUNT(*) AS headcount, ROUND(AVG(salary), 2) AS avg_salary")
            .group(:department)
            .order("headcount DESC")
            .map { |r| { department: r.department, headcount: r.headcount, avg_salary: r.avg_salary.to_f } }

          render json: { data: data }
        end
      end
    end
  end
end
