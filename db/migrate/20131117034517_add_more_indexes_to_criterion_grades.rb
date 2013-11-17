class AddMoreIndexesToCriterionGrades < ActiveRecord::Migration
  def change
    add_column :criterion_grades, :assessment_types_id, :integer
    add_index  :criterion_grades, :assessment_types_id
    add_column :criterion_grades, :section_id, :integer
    add_index  :criterion_grades, :section_id
    add_column :criterion_grades, :term_id, :integer
    add_index  :criterion_grades, :term_id
    add_column :criterion_grades, :user_id, :integer
    add_index  :criterion_grades, :user_id
    
    change_column :students, :sid, :string
  end
end
