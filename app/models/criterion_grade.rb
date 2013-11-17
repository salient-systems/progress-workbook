class CriterionGrade < ActiveRecord::Base
   belongs_to :criterion
   belongs_to :student
   belongs_to :assessment
   belongs_to :assessment_type
   belongs_to :section
   belongs_to :user
end
