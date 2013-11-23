class CriterionGrade < ActiveRecord::Base
   belongs_to :criterion
   belongs_to :student
   belongs_to :assessment
   belongs_to :assessment_type
   belongs_to :section
   belongs_to :user
   
   attr_accessor :assessment_name
   attr_accessor :criterion_name
   
   def as_json(options={})
     options[:methods] ||= []
     options[:methods] << :assessment_name
     options[:methods] << :criterion_name
     super(options)
   end
end
