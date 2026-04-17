module Api
  module V1
    module Insights
      # Insight: top-paying job titles — useful for comp benchmarking
      class TopPayingTitlesController < InsightsController
        def show
          limit = [(params[:limit] || 10).to_i, 50].min

          data = Employee
            .select("job_title, ROUND(AVG(salary), 2) AS avg_salary, COUNT(*) AS headcount")
            .group(:job_title)
            .order("avg_salary DESC")
            .limit(limit)
            .map { |r| { job_title: r.job_title, avg_salary: r.avg_salary.to_f, headcount: r.headcount } }

          render json: { data: data }
        end
      end
    end
  end
end
