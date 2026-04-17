module Api
  module V1
    module Insights
      class InsightsController < ApplicationController
        private

        def salary_stats_query(scope)
          scope.select(
            "MIN(salary) AS min_salary",
            "MAX(salary) AS max_salary",
            "ROUND(AVG(salary), 2) AS avg_salary",
            "COUNT(*) AS headcount"
          )
        end
      end
    end
  end
end
