module Api
  module V1
    class EmployeesController < ApplicationController
      before_action :set_employee, only: %i[show update destroy]

      def index
        employees = Employee.all

        employees = employees.where("full_name ILIKE ?", "%#{params[:search]}%") if params[:search].present?
        employees = employees.where(country: params[:country])                    if params[:country].present?
        employees = employees.where(department: params[:department])              if params[:department].present?
        employees = employees.where(employment_status: params[:status])           if params[:status].present?

        total = employees.count
        employees = employees.order(order_clause).page(params[:page]).per(params[:per_page] || 25)

        render json: {
          employees: employees.as_json(only: employee_fields),
          meta: { total: total, page: (params[:page] || 1).to_i, per_page: (params[:per_page] || 25).to_i }
        }
      end

      def show
        render json: @employee.as_json(only: employee_fields)
      end

      def create
        employee = Employee.new(employee_params)
        if employee.save
          render json: employee.as_json(only: employee_fields), status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @employee.update(employee_params)
          render json: @employee.as_json(only: employee_fields)
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @employee.destroy
        head :no_content
      end

      private

      def set_employee
        @employee = Employee.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Employee not found" }, status: :not_found
      end

      def employee_params
        params.require(:employee).permit(
          :full_name, :email, :job_title, :department,
          :country, :salary, :hire_date, :employment_status
        )
      end

      def employee_fields
        %i[id full_name email job_title department country salary hire_date employment_status created_at updated_at]
      end

      def order_clause
        allowed = %w[full_name job_title country salary hire_date]
        col = allowed.include?(params[:sort]) ? params[:sort] : "full_name"
        dir = params[:dir] == "desc" ? "DESC" : "ASC"
        "#{col} #{dir}"
      end
    end
  end
end
