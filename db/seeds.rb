# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

# Numbers taken from SRS

NUM_MODIFIER = 1

NUM_USERS = 50 * NUM_MODIFIER
NUM_SUBJECTS = 10 * NUM_MODIFIER
NUM_SECTIONS = 250 * NUM_MODIFIER
NUM_STUDENTS = 1000 * NUM_MODIFIER
NUM_COHORTS = 20 * NUM_MODIFIER
NUM_GRADED_SECTIONS = 10
NUM_ASS_TYPES = NUM_GRADED_SECTIONS * NUM_MODIFIER
NUM_ASSESSMENTS = 8 * 4 * NUM_ASS_TYPES * NUM_MODIFIER
NUM_CRITERIA = 5 * NUM_ASSESSMENTS * NUM_MODIFIER
NUM_CRITERION_GRADES = 1 * NUM_CRITERIA * NUM_MODIFIER
NUM_ASSESSMENT_GRADES = 1 * NUM_ASSESSMENTS * NUM_MODIFIER

rng = Random.new(1138)

puts "-- seeding database"

puts "   -> creating users"
fnames = ["James", "Brett", "Jacob", "Natalie", "Brandon", "Jayden", "Alena", "Owen", "Ryan", "Malaya"]
lnames = ["Andrews", "Christian", "Hogan", "Hernandez", "Lambert", "Soto", "Small", "Tuttle", "Warren", "Thomas"]
users = Array.new
1.upto(NUM_USERS) do |num|
	users[num] = User.create(fname: fnames[rng.rand(fnames.length)],
		lname: lnames[rng.rand(lnames.length)],
		username: "user#{num}",
		password: "pass#{num}",
		is_active: num % 11 != 0,
		is_admin: num % 7 == 0)
end

puts "   -> creating subjects"
snames = ["Physical Science", "Math", "English", "PE", "Computer Science", "Physics", "Art", "Engineering", "Music", "History"]
subjects = Array.new
1.upto(NUM_SUBJECTS) do |num|
	subjects[num] = Subject.create(name: snames[num % 10])
end

puts "   -> creating students"
fnames = ["James", "Brett", "Jacob", "Natalie", "Brandon", "Jayden", "Alena", "Owen", "Ryan", "Malaya", "Jean-Luc", "Bella", "Anakin", "Joyce", "Sarah", "Billie", "Walky", "Sal", "Dorothy", "Danny", "Ethan", "Amber", "Dina", "Roz", "Becky", "Ruth", "Joe", "Mike", "Marten", "Faye"]
lnames = ["Torvalds", "Jobs", "Turing", "Bush", "Obama", "Jones", "Sagan", "Field", "Wales", "Lee", "Kelly", "Cruz", "Reagan", "Andrews", "Christian", "Hogan", "Hernandez", "Lambert", "Soto", "Small", "Tuttle", "Warren", "Thomas", "Gates", "Elop", "Stallman", "Musk", "Scoble", "Montana", "Kenobi", "Vega", "Wallace", "White", "Kirk", "Picard"]
genders = ["m", "f", nil]
students = Array.new
1.upto(NUM_STUDENTS) do |num|
	students[num] = Student.create(fname: fnames[rng.rand(fnames.length)],
		lname: lnames[rng.rand(lnames.length)],
		gender: genders[num % 3],
		grade_level: rng.rand(3)+6,
		sid: num + 1137,
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
	1.upto(10) do |student_mod|
		CohortStudent.create(cohort_id: cohorts[cohort].id, student: students[(i - 1) % NUM_STUDENTS + 1])
		i = i + 1
	end
end

puts "   -> creating terms"
Term.create(name: "2012-2013");
Term.create(name: "2013-2014");

puts "   -> creating sections"
number = ["1", "2", "3", "4"]
level = ["Beginner", "Intermediate", "Advanced", "AP", "Honors"]
topic = ["Math", "English", "Underwater Basketweaving", "Star Wars", "Quantum Mechanics", "Physical Science", "UNIX", "Physics", "Senior Project", "Statistics"]
modifier = ["for Engineers", "for Art Majors", "for Business Majors"]
sectionnames = (number.product(level).product(topic).product(modifier)).map{|x| x[0][0][1] + " " + x[0][1] + " " + x[1] + " (" + x[0][0][0] + ")"}
sections = Array.new
1.upto(NUM_SECTIONS) do |num|
	sections[num] = Section.create(name: sectionnames[num],
		grade_level: rng.rand(3)+6,
		user_id: users[(num - 1) % NUM_USERS + 1].id,
		period: rng.rand(6)+1,
		subject_id: subjects[rng.rand(subjects.length - 1) + 1].id,
		term_id: num % 2 + 1)
end

puts "   -> creating classstudent associations"
i = 1
1.upto(NUM_SECTIONS) do |section_id|
	1.upto(10) do |student_mod|
		ClassStudent.create(section: sections[section_id], student: students[(i - 1) % NUM_STUDENTS + 1])
		i = i + 1
	end
end

# '#{num} appears to be required in order for subsequent iterations to appear in the database
puts "   -> creating assessment types"
1.upto(NUM_ASS_TYPES) do |num|
  AssessmentType.create(name: "Learning Check - Section #{num}", section_id: num, view: 1)
  AssessmentType.create(name: "I Can... - Section #{num}", section_id: num, view: 2)
  AssessmentType.create(name: "Lab Report - Section #{num}", section_id: num, view: 3)
  AssessmentType.create(name: "Tech Design - Section #{num}", section_id: num, view: 3)
end

puts "   -> creating assessments"
1.upto(NUM_ASSESSMENTS) do |num|
	Assessment.create(data_type: num%2 + 1,
		subject: "Subject #{num}",
		name: "Assessment #{num}",
		assessment_type_id: (num - 1) % (NUM_ASS_TYPES*4) + 1)
end

puts "   -> creating criteria"
criteria = Array.new(NUM_CRITERIA + 1)
1.upto(NUM_CRITERIA) do |num|
  assessment = (num - 1) % NUM_ASSESSMENTS + 1
  assessment_type = (assessment - 1) % (NUM_ASS_TYPES*4) + 1
  if ((assessment_type % 4 != 1) or (num < NUM_ASSESSMENTS))
  	criteria[num] = Criterion.create(max: 10,
  		name: "Criterion #{num}",
  		assessment_id: assessment)
  end
end

puts "   -> creating criterion grades"
1.upto(NUM_CRITERIA) do |criterion|
  if criteria[criterion] != nil
    1.upto(10) do |student|
      rng = Random.new(criterion * 10 + student)
      assessment = ((criterion - 1) % NUM_ASSESSMENTS + 1)
      assessment_type = (assessment - 1) % (NUM_ASS_TYPES*4) + 1
      section = (assessment_type - 1) / 4 + 1
      user = (section - 1) % NUM_USERS + 1
      student_id = ((section - 1) * 10 + student - 1) % NUM_STUDENTS + 1
      CriterionGrade.create(score: rng.rand(10) + 1,
        student_id: student_id,
        criterion_id: criteria[criterion].id,
        assessment_id: assessment,
        assessment_type_id: assessment_type,
        section_id: section,
        user_id: user)
    end
  end
end
