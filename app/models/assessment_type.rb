class AssessmentType < ActiveRecord::Base
    validates :name, :presence => true
    validates :view, :presence => true

    has_one :section, through: :assessment

    belongs_to :assessments, dependent: :destroy
end
