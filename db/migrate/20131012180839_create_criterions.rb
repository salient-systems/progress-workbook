class CreateCriterions < ActiveRecord::Migration
  def change
    create_table :criterions do |t|
      t.float :max
      t.string :name
      t.integer :assessment_id

      t.timestamps
    end
  end
end
