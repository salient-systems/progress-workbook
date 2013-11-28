class Section < ActiveRecord::Base
    validates :name, :presence => true
    validates :grade_level, :presence => true

    belongs_to :subject
    belongs_to :user

    has_many :assessment_types, dependent: :destroy
    has_many :class_students, dependent: :destroy
    belongs_to :term

    has_many :students, through: :class_students
    has_many :criterion_grade
end
