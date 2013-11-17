json.array!(@cohorts) do |cohort|
  json.value cohort.name
  json.id cohort.id
  json.tokens [cohort.name]
end