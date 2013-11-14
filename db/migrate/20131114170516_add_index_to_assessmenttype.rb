class AddIndexToAssessmenttype < ActiveRecord::Migration
  def change
    add_index :assessment_types, :section_id
  end
end
