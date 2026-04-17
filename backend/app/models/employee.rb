class Employee < ApplicationRecord
  EMPLOYMENT_STATUSES = %w[active inactive terminated].freeze

  validates :full_name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :job_title, presence: true, length: { maximum: 100 }
  validates :department, presence: true, length: { maximum: 100 }
  validates :country, presence: true, length: { maximum: 100 }
  validates :salary, presence: true, numericality: { greater_than: 0 }
  validates :hire_date, presence: true
  validates :employment_status, inclusion: { in: EMPLOYMENT_STATUSES }

  before_save { email.downcase! }

  scope :active, -> { where(employment_status: "active") }
  scope :by_country, ->(country) { where(country: country) }
end
