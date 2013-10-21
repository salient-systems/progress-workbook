# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Numbers chosen by taking SRS estimates and doubling them
NUM_USERS = 100
NUM_SUBJECTS = 20
NUM_SECTIONS = 500
NUM_STUDENTS = 2000
NUM_COHORTS = 20

puts "-- seeding database"

puts "   -> creating users"
users = Array.new
1.upto(NUM_USERS) do |num|
	users[num] = User.create(fname: "TestUser",
		lname: "Number#{num}",
		username: "user#{num}",
		password: "pass#{num}",
		is_active: num % 11 != 0,
		is_admin: num % 7 == 0)
end

puts "   -> creating subjects"
subjects = Array.new
1.upto(NUM_SUBJECTS) do |num|
	subjects[num] = Subject.create(name: "Subject #{num}")
end

puts "   -> creating students"
genders = ["m", "f", nil]
students = Array.new
1.upto(NUM_STUDENTS) do |num|
	students[num] = Student.create(fname: "TestStudent",
		lname: "Number#{num}",
		gender: genders[num % 3],
		grade_level: num % 3 + 6,
		is_active: num % 11 != 0)
end

puts "   -> creating cohorts"
cohorts = Array.new
1.upto(NUM_COHORTS) do |num|
	cohorts[num] = Cohort.create(name: "Cohort #{num}")
end

puts "   -> creating cohortstudent associations"
i=1
1.upto(NUM_COHORTS) do |cohort|
	1.upto(100) do |student_mod|
		CohortStudent.create(cohort_id: cohorts[cohort].id, student: students[i % NUM_STUDENTS + 1])
		i = i + 1
	end
end

puts "   -> creating sections"
sections = Array.new
1.upto(NUM_SECTIONS) do |num|
	sections[num] = Section.create(name: "Underwater Basketweaving Section #{num}",
		grade_level: num % 3 + 6,
		start_date: "07/01/2013",
		end_date: "06/01/2014",
		user_id: users[num % NUM_USERS + 1].id,
		subject_id: subjects[num % NUM_SUBJECTS + 1].id)
end

puts "   -> creating classstudent associations"
i = 1
1.upto(NUM_SECTIONS) do |section_id|
	1.upto(25) do |student_mod|
		ClassStudent.create(section: sections[section_id], student: students[i % NUM_STUDENTS + 1])
		i = i + 1
	end
end

