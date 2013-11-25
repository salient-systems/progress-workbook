json.students @students do |student|
  json.value student.fname + ' ' + student.lname
  json.id student.id
  json.tokens [student.fname, student.lname, student.sid.to_s]
end

json.cohorts @cohorts do |cohort|
  json.value cohort.name
  json.id cohort.id
  json.tokens [cohort.name]
end

json.users @users do |user|
  json.value user.fname + ' ' + user.lname
  json.id user.id
  json.tokens [user.fname, user.lname]
end