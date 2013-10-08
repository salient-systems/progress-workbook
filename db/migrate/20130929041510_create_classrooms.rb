class CreateClassrooms < ActiveRecord::Migration
  def change
    create_table :classrooms do |t|
      t.string :name
      t.integer :period
      t.date :start_date
      t.date :end_date
      t.integer :grade_level
      t.integer :user_id

      t.timestamps
    end
  end
end
