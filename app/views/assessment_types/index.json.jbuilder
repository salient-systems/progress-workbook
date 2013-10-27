json.array!(@assessment_types) do |assessment_type|
  json.extract! assessment_type, :name, :section_id, :view
  json.url assessment_type_url(assessment_type, format: :json)
end
