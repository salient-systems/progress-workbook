class AddKeysForTermsTable < ActiveRecord::Migration
  def change
    remove_column :sections, :term
    add_column :sections, :term_id, :integer
    add_index :sections, :term_id
  end
end
