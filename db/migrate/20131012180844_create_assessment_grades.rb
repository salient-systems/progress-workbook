class CreateAssessmentGrades < ActiveRecord::Migration
  def change
    create_table :assessment_grades do |t|
      t.float :total
      t.integer :assessment_id
      t.integer :student_id

      t.timestamps
    end
  end
end
