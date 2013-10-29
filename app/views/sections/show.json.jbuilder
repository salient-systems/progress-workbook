json.extract! @section, :id, :name, :grade_level, :start_date, :end_date, :subject_id, :created_at, :updated_at

json.set! :user do
  json.extract! @section.user, :fname, :lname
end

json.set! :subject do
  json.extract! @section.subject, :name
end