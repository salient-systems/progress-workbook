class Student < ActiveRecord::Base
  validates :fname, :presence => true
  validates :lname, :presence => true
  validates :gender, :presence => true
  validates_inclusion_of :gender, :in => %w( m f )
  validates :grade_level, :presence => true
  validates :is_active, :presence => true
end
