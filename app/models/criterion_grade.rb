class CriterionGrade < ActiveRecord::Base
   belongs_to :criterion
   belongs_to :student
   belongs_to :assessment
end
