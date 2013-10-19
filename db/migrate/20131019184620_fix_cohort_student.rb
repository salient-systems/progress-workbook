class FixCohortStudent < ActiveRecord::Migration
  def change
     remove_column :cohort_students, :user_id
     add_column :cohort_students, :cohort_id, :integer
     add_index :cohort_students, :cohort_id
     change_column :cohort_students, :cohort_id, :integer, :null => false
  end
end
