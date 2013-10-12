class AddForeignKeysAndOtherConstraints < ActiveRecord::Migration
  def change
    
    #add username
    add_column :users, :username, :string
    
    # add foreign keys
    add_index :cohort_students, :student_id 
    add_index :cohort_students, :user_id 
    add_index :sections, :subject_id 
    add_index :sections, :user_id 
    add_index :assessments, :section_id 
    add_index :assessments, :assessment_type_id 
    add_index :criterions, :assessment_id 
    add_index :criterion_grades, :criterion_id 
    add_index :criterion_grades, :student_id 
    add_index :criterion_grades, :assessment_id 
    add_index :assessment_grades, :assessment_id 
    add_index :assessment_grades, :student_id 
    add_index :class_students, :section_id 
    add_index :class_students, :student_id 
     
     
    #Adding Not Nulls 
     
     
    change_column :students, :fname, :string, :null => false 
    change_column :students, :lname, :string, :null => false 
    change_column :students, :gender, :string, :null => false 
    change_column :students, :grade_level, :integer, :null => false 
    change_column :students, :is_active, :boolean, :null => false 
     
     
    change_column :cohorts, :name, :string, :null => false 
     
     
    change_column :cohort_students, :student_id, :integer, :null => false 
    change_column :cohort_students, :user_id, :integer, :null => false 
     
     
    change_column :users, :username, :string, :null => false 
    change_column :users, :fname, :string, :null => false 
    change_column :users, :lname, :string, :null => false 
    change_column :users, :is_active, :boolean, :null => false 
    change_column :users, :is_admin, :boolean, :null => false 
    change_column :users, :password, :string, :null => false 
     
     
    change_column :sections, :name, :string, :null => false 
    change_column :sections, :grade_level, :integer, :null => false 
    change_column :sections, :start_date, :date, :null => false 
    change_column :sections, :end_date, :date, :null => false 
    change_column :sections, :subject_id, :integer, :null => false 
    change_column :sections, :user_id, :integer, :null => false 
     
     
    change_column :assessment_types, :name, :string, :null => false 
    change_column :assessment_types, :view, :integer, :null => false 
     
     
    change_column :assessments, :name, :string, :null => false 
    change_column :assessments, :data_type, :integer, :null => false 
    change_column :assessments, :subject, :string, :null => false 
    change_column :assessments, :section_id, :integer, :null => false 
    change_column :assessments, :assessment_type_id, :integer, :null => false 
     
     
    change_column :criterions, :name, :string, :null => false 
    change_column :criterions, :max, :float, :null => false 
    change_column :criterions, :assessment_id, :integer, :null => false 
     
     
    #change_column :criterion_grades, :score, :float, :null => false 
    change_column :criterion_grades, :student_id, :integer, :null => false 
    change_column :criterion_grades, :criterion_id, :integer, :null => false 
    change_column :criterion_grades, :assessment_id, :integer, :null => false 
     
     
    #change_column :assessment_grades, :total, :float, :null => false 
    change_column :assessment_grades, :assessment_id, :integer, :null => false 
    change_column :assessment_grades, :student_id, :integer, :null => false 
     
     
    change_column :class_students, :section_id, :integer, :null => false 
    change_column :class_students, :student_id, :integer, :null => false 
  end
end
