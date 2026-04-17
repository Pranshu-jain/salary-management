Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :employees

      namespace :insights do
        get :salary_by_country,   to: "salary_by_country#show"
        get :salary_by_job_title, to: "salary_by_job_title#show"
        get :department_headcount, to: "department_headcount#show"
        get :tenure_bands,         to: "tenure_bands#show"
        get :top_paying_titles,    to: "top_paying_titles#show"
      end
    end
  end
end
