class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :fname
      t.string :lname
      t.boolean :is_active
      t.boolean :is_admin
      t.string :password

      t.timestamps
    end
  end
end
