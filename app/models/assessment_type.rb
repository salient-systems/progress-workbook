class AssessmentType < ActiveRecord::Base
    validates :name, :presence => true, :uniqueness => true
    validates :view, :presence => true
    
    has_many :assessments
end
