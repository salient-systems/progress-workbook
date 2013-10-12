class Cohort < ActiveRecord::Base
  validates :name, :presence => true, :uniqueness => true
  
  has_many :cohort_student
end
