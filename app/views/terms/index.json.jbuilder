json.array!(@terms) do |term|
  json.extract! term, :name, :id
  json.url term_url(term, format: :json)
end
