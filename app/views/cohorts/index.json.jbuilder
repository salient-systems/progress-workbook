json.array!(@cohorts) do |cohort|
  json.extract! cohort, :name
  json.url cohort_url(cohort, format: :json)
end
