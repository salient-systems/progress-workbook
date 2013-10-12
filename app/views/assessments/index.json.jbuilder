json.array!(@assessments) do |assessment|
  json.extract! assessment, :data_type, :subject, :name, :section_id, :assessment_type_id
  json.url assessment_url(assessment, format: :json)
end
