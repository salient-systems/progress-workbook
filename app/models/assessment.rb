class Assessment < ActiveRecord::Base
    validates :name, :presence => true
    validates :subject, :presence => true
    validates :data_type, :presence => true

    belongs_to :assessment_type

    has_many :criterions
    has_many :assessment_grades
    has_many :criterion_grade
end
