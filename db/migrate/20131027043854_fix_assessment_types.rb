class FixAssessmentTypes < ActiveRecord::Migration
  def change
     remove_column :assessments, :section_id
     add_column :assessment_types, :section_id, :integer
  end
end