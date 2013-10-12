class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :fname
      t.string :lname
      t.string :gender
      t.integer :grade_level
      t.boolean :is_active

      t.timestamps
    end
  end
end
