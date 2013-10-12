class ChangeGenderColumn2 < ActiveRecord::Migration
  def change
    change_column :students, :gender, :string, :null => true
  end
end
