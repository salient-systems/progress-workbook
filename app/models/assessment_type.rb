class AssessmentType < ActiveRecord::Base
    validates :name, :presence => true
    validates :view, :presence => true

    belongs_to :section
    has_many :assessments, dependent: :destroy
    has_many :criterion_grade
end
