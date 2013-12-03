json.array!(@criterion_grades) do |grade|
  json.extract! grade, :score, :assessment_type_id
  json.assessmentTypeName grade.assessment_type.name
  json.criterionId grade.criterion.id
  json.criterionName grade.criterion.name
  json.criterionMax grade.criterion.max
end