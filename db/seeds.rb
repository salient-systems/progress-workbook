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

1.upto(NUM_USERS) do |num|
	User.create(fname: "TestUser",
		    lname: "Number#{num}",
		    username: "user#{num}",
		    password: "pass#{num}",
		    is_active: num % 11 != 0,
		    is_admin: num % 7 == 0)
end

1.upto(NUM_SUBJECTS) do |num|
	Subject.create(name: "Subject #{num}")
end

1.upto(NUM_SECTIONS) do |num|
	Section.create(name: "Underwater Basketweaving Section #{num}",
		       grade_level: num % 3 + 6,
		       start_date: "07/01/2013",
		       end_date: "06/01/2014",
		       user_id: num % NUM_USERS + 1,
		       subject_id: num % NUM_SUBJECTS + 1)
end

1.upto(NUM_STUDENTS) do |num|
	student = Student.create(fname: "TestStudent",
		       lname: "Number#{num}",
		       gender: (num % 2 == 0 ? "m" : "f"),
		       grade_level: num % 3 + 6,
		       is_active: num % 11 != 0)
end
