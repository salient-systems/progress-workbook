class Student < ActiveRecord::Base
  validates :fname, :presence => true
  validates :lname, :presence => true
  validates :gender, :presence => true
  validates_inclusion_of :gender, :in => %w( m f )
  validates :grade_level, :presence => true
  validates :is_active, :presence => true
  
  has_many :class_students
  has_many :criterion_grades
  has_many :assessment_grades
  has_many :cohort_students
  
  has_many :cohorts, through: :cohort_students
  has_many :sections, through: :class_students
end
