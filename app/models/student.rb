class Student < ActiveRecord::Base
  validates :fname, :presence => true
  validates :lname, :presence => true
  validates_inclusion_of :gender, :in => %w( m f ), :allow_nil => true
  validates :grade_level, :presence => true

  has_many :class_students
  has_many :criterion_grades
  has_many :assessment_grades
  has_many :cohort_students

  has_many :cohorts, through: :cohort_students
  has_many :sections, through: :class_students
  has_many :users, through: :sections
  
  has_many :criterions, through: :criterion_grades
  has_many :assessments, through: :criterion_grades
end
