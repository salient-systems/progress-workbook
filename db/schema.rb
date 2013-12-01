# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131120164809) do

  create_table "assessment_grades", force: true do |t|
    t.float    "total"
    t.integer  "assessment_id", null: false
    t.integer  "student_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "assessment_grades", ["assessment_id"], name: "index_assessment_grades_on_assessment_id", using: :btree
  add_index "assessment_grades", ["student_id"], name: "index_assessment_grades_on_student_id", using: :btree

  create_table "assessment_types", force: true do |t|
    t.string   "name",       null: false
    t.integer  "view",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "section_id"
  end

  add_index "assessment_types", ["section_id"], name: "index_assessment_types_on_section_id", using: :btree

  create_table "assessments", force: true do |t|
    t.integer  "data_type",          null: false
    t.string   "subject",            null: false
    t.string   "name",               null: false
    t.integer  "assessment_type_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "assessments", ["assessment_type_id"], name: "index_assessments_on_assessment_type_id", using: :btree

  create_table "class_students", force: true do |t|
    t.integer  "section_id", null: false
    t.integer  "student_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "class_students", ["section_id"], name: "index_class_students_on_section_id", using: :btree
  add_index "class_students", ["student_id"], name: "index_class_students_on_student_id", using: :btree

  create_table "cohort_students", force: true do |t|
    t.integer  "student_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "cohort_id",  null: false
  end

  add_index "cohort_students", ["cohort_id"], name: "index_cohort_students_on_cohort_id", using: :btree
  add_index "cohort_students", ["student_id"], name: "index_cohort_students_on_student_id", using: :btree

  create_table "cohorts", force: true do |t|
    t.string   "name",       null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "criterion_grades", force: true do |t|
    t.float    "score"
    t.integer  "student_id",         null: false
    t.integer  "criterion_id",       null: false
    t.integer  "assessment_id",      null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "assessment_type_id"
    t.integer  "section_id"
    t.integer  "user_id"
  end

  add_index "criterion_grades", ["assessment_id"], name: "index_criterion_grades_on_assessment_id", using: :btree
  add_index "criterion_grades", ["assessment_type_id"], name: "index_criterion_grades_on_assessment_type_id", using: :btree
  add_index "criterion_grades", ["criterion_id"], name: "index_criterion_grades_on_criterion_id", using: :btree
  add_index "criterion_grades", ["section_id"], name: "index_criterion_grades_on_section_id", using: :btree
  add_index "criterion_grades", ["student_id"], name: "index_criterion_grades_on_student_id", using: :btree
  add_index "criterion_grades", ["user_id"], name: "index_criterion_grades_on_user_id", using: :btree

  create_table "criterions", force: true do |t|
    t.float    "max",           null: false
    t.string   "name",          null: false
    t.integer  "assessment_id", null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "criterions", ["assessment_id"], name: "index_criterions_on_assessment_id", using: :btree

  create_table "sections", force: true do |t|
    t.string   "name",        null: false
    t.integer  "grade_level", null: false
    t.integer  "subject_id",  null: false
    t.integer  "user_id",     null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "period"
    t.integer  "term_id"
  end

  add_index "sections", ["subject_id"], name: "index_sections_on_subject_id", using: :btree
  add_index "sections", ["term_id"], name: "index_sections_on_term_id", using: :btree
  add_index "sections", ["user_id"], name: "index_sections_on_user_id", using: :btree

  create_table "students", force: true do |t|
    t.string   "fname",       null: false
    t.string   "lname",       null: false
    t.string   "gender"
    t.integer  "grade_level", null: false
    t.boolean  "is_active",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "sid",         null: false
  end

  create_table "subjects", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "terms", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "username",   null: false
    t.string   "fname",      null: false
    t.string   "lname",      null: false
    t.boolean  "is_active",  null: false
    t.boolean  "is_admin",   null: false
    t.string   "password",   null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
