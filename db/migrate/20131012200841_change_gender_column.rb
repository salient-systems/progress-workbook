class ChangeGenderColumn < ActiveRecord::Migration
  def change
    change_column :students, :gender, :string
  end
end
