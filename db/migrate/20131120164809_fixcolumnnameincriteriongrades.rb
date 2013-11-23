class Fixcolumnnameincriteriongrades < ActiveRecord::Migration
  def change
    rename_column :criterion_grades, :assessment_types_id, :assessment_type_id
  end
end
