class Section < ActiveRecord::Base
    validates :name, :presence => true
    validates :grade_level, :presence => true
    
    belongs_to :subject
    belongs_to :user

    has_many :assessment_types
    has_many :class_students
    has_many :terms

    has_many :students, through: :class_students
end
