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

ActiveRecord::Schema.define(version: 20131012180923) do

  create_table "assessment_grades", force: true do |t|
    t.float    "total"
    t.integer  "assessment_id"
    t.integer  "student_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "assessment_types", force: true do |t|
    t.integer  "name"
    t.integer  "view"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "assessments", force: true do |t|
    t.integer  "data_type"
    t.string   "subject"
    t.string   "name"
    t.integer  "section_id"
    t.integer  "assessment_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "class_students", force: true do |t|
    t.integer  "section_id"
    t.integer  "student_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cohort_students", force: true do |t|
    t.integer  "student_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cohorts", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "criterion_grades", force: true do |t|
    t.float    "score"
    t.integer  "student_id"
    t.integer  "criterion_id"
    t.integer  "assessment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "criterions", force: true do |t|
    t.float    "max"
    t.string   "name"
    t.integer  "assessment_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sections", force: true do |t|
    t.string   "name"
    t.integer  "grade_level"
    t.date     "start_date"
    t.date     "end_date"
    t.integer  "subject_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "students", force: true do |t|
    t.string   "fname"
    t.string   "lname"
    t.string   "gender"
    t.integer  "grade_level"
    t.boolean  "is_active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "subjects", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "fname"
    t.string   "lname"
    t.boolean  "is_active"
    t.boolean  "is_admin"
    t.string   "password"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
