json.array!(@criterions) do |criterion|
  json.extract! criterion, :max, :name, :assessment_id
  json.url criterion_url(criterion, format: :json)
end
