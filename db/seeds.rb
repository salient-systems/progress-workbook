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
fnames = ["James", "Brett", "Jacob", "Natalie", "Brandon", "Jayden", "Alena", "Owen", "Ryan", "Malaya"]
lnames = ["Andrews", "Christian", "Hogan", "Hernandez", "Lambert", "Soto", "Small", "Tuttle", "Warren", "Thomas"]
names = fnames.product(lnames)
users = Array.new
1.upto(NUM_USERS) do |num|
	users[num] = User.create(fname: names[num-1][0],
		lname: names[num-1][1],
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
fnames = ["James", "Brett", "Jacob", "Natalie", "Brandon", "Jayden", "Alena", "Owen", "Ryan", "Malaya", "Victor", "David", "Robert"]
lnames1 = ["Torvalds", "Jobs", "Turing", "Bush", "Obama", "Jones", "Sagan", "Field", "Gordon", "Clevenger", "Jin", "Cruz", "Reagan"]
lnames2 = ["Andrews", "Christian", "Hogan", "Hernandez", "Lambert", "Soto", "Small", "Tuttle", "Warren", "Thomas", "Wall", "Devereux", "Kramer"]
lnames = lnames1.product(lnames2).map{|x| x[0] + "-" + x[1]}
names = fnames.product(lnames)
genders = ["m", "f", nil]
students = Array.new
1.upto(NUM_STUDENTS) do |num|
	students[num] = Student.create(fname: names[num-1][0],
		lname: names[num-1][1],
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
periods = ["1", "2", "3", "4", "5", "6"]
level = ["Beginner", "Intermediate", "Advanced", "AP", "Honors"]
topic = ["Math", "English", "Underwater Basketweaving", "Star Wars", "Quantum Mechanics", "Physical Science", "UNIX", "Women's Studies", "Senior Project", "Statistics"]
modifier = ["for Engineers", "for Art Majors", "for Business Majors"]
sectionnames = (periods.product(level).product(topic).product(modifier)).map{|x| x[0][0][0] + " - " + x[0][0][1] + " " + x[0][1] + " " + x[1]}
sections = Array.new
1.upto(NUM_SECTIONS) do |num|
	sections[num] = Section.create(name: sectionnames[num],
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

