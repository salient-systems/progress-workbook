class CreateAssessments < ActiveRecord::Migration
  def change
    create_table :assessments do |t|
      t.integer :data_type
      t.string :subject
      t.string :name
      t.integer :section_id
      t.integer :assessment_type_id

      t.timestamps
    end
  end
end
