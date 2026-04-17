module Api
  module V1
    module Insights
      class SalaryByJobTitleController < InsightsController
        def show
          scope = Employee.all
          scope = scope.where(country: params[:country]) if params[:country].present?

          data = scope
            .select("job_title, country, MIN(salary) AS min_salary, MAX(salary) AS max_salary, ROUND(AVG(salary), 2) AS avg_salary, COUNT(*) AS headcount")
            .group(:job_title, :country)
            .order(:country, :job_title)
            .map { |r| { job_title: r.job_title, country: r.country, min: r.min_salary.to_f, max: r.max_salary.to_f, avg: r.avg_salary.to_f, headcount: r.headcount } }

          render json: { data: data }
        end
      end
    end
  end
end
