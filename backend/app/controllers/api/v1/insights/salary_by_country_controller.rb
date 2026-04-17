module Api
  module V1
    module Insights
      class SalaryByCountryController < InsightsController
        def show
          data = Employee
            .select("country, MIN(salary) AS min_salary, MAX(salary) AS max_salary, ROUND(AVG(salary), 2) AS avg_salary, COUNT(*) AS headcount")
            .group(:country)
            .order(:country)
            .map { |r| { country: r.country, min: r.min_salary.to_f, max: r.max_salary.to_f, avg: r.avg_salary.to_f, headcount: r.headcount } }

          render json: { data: data }
        end
      end
    end
  end
end
