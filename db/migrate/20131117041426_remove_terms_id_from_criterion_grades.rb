class RemoveTermsIdFromCriterionGrades < ActiveRecord::Migration
  def change
    remove_column :criterion_grades, :term_id
  end
end
