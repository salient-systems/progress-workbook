class CreateAssessmentTypes < ActiveRecord::Migration
  def change
    create_table :assessment_types do |t|
      t.integer :name
      t.integer :view

      t.timestamps
    end
  end
end
