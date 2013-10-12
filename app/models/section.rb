class Section < ActiveRecord::Base
    validates :name, :presence => true
    validates :grade_level, :presence => true
    validates :start_date, :presence => true
    validates :end_date, :presence => true
    
    belongs_to :subject
    belongs_to :user
    
    has_many :assessments
    has_many :class_students
    
    has_many :students, through: :class_students
end
