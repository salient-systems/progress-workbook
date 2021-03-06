json.array!(@assessments) do |assessment|
  json.extract! assessment, :id, :data_type, :subject, :name, :assessment_type_id
  json.url assessment_url(assessment, format: :json)
end
