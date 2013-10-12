class CreateCriterionGrades < ActiveRecord::Migration
  def change
    create_table :criterion_grades do |t|
      t.float :score
      t.integer :student_id
      t.integer :criterion_id
      t.integer :assessment_id

      t.timestamps
    end
  end
end
