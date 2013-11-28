json.array!(@criterion_grades) do |criterion_grade|
  json.max criterion_grade.criterion.max
  json.dataPoint [criterion_grade.assessment.name, criterion_grade.score]
end