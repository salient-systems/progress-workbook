json.array!(@assessments) do |assessment|
  json.extract! assessment, :id, :name
  json.grades assessment.criterion_grade, :score, :student_id, :criterion_id
  json.numStudents @numStudents
  
  json.criteria do
    assessment.criterions.each { |criterion|
      json.set! criterion.id, criterion, :max, :name
    }
  end
end