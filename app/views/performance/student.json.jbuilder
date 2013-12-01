json.array!(@criterion_grades) do |grade|
  json.extract! grade, :score, :assessment_id
  json.assessmentName grade.assessment.name
  json.criterionId grade.criterion.id
  json.criterionName grade.criterion.name
  json.criterionMax grade.criterion.max
end