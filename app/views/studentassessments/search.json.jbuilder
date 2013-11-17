json.array!(@students) do |student|
  json.value student.fname + ' ' + student.lname
  json.id student.id
  json.tokens [student.fname, student.lname, student.sid.to_s]
end