class AssessmentType < ActiveRecord::Base
    validates :name, :presence => true, :uniqueness => true
    validates :view, :presence => true

    belongs_to :section

    has_many :assessments
end
