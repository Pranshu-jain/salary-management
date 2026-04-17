module Api
  module V1
    module Insights
      # Insight: tenure distribution — useful for attrition risk and succession planning
      class TenureBandsController < InsightsController
        def show
          data = Employee
            .select(<<~SQL)
              CASE
                WHEN hire_date >= CURRENT_DATE - INTERVAL '1 year'  THEN '0-1 years'
                WHEN hire_date >= CURRENT_DATE - INTERVAL '3 years' THEN '1-3 years'
                WHEN hire_date >= CURRENT_DATE - INTERVAL '5 years' THEN '3-5 years'
                ELSE '5+ years'
              END AS band,
              COUNT(*) AS headcount,
              ROUND(AVG(salary), 2) AS avg_salary
            SQL
            .group("band")
            .order("band")
            .map { |r| { band: r.band, headcount: r.headcount, avg_salary: r.avg_salary.to_f } }

          render json: { data: data }
        end
      end
    end
  end
end
