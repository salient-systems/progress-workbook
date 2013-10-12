class CreateSections < ActiveRecord::Migration
  def change
    create_table :sections do |t|
      t.string :name
      t.integer :grade_level
      t.date :start_date
      t.date :end_date
      t.integer :subject_id
      t.integer :user_id

      t.timestamps
    end
  end
end
