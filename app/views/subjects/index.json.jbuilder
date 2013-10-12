json.array!(@subjects) do |subject|
  json.extract! subject, :name
  json.url subject_url(subject, format: :json)
end
