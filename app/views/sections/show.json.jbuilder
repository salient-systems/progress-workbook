json.extract! @section, :id, :name, :grade_level, :term, :period, :subject_id, :created_at, :updated_at

json.set! :user do
  json.extract! @section.user, :fname, :lname, :id
end

json.set! :subject do
  json.extract! @section.subject, :name
end