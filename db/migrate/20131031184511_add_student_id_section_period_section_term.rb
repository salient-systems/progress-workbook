class AddStudentIdSectionPeriodSectionTerm < ActiveRecord::Migration
  def change
    remove_column :sections, :start_date
    remove_column :sections, :end_date
    add_column :sections, :term, :string
    add_column :sections, :period, :integer
    add_column :students, :sid, :integer
  end
end
