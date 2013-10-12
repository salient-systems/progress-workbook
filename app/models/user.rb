class User < ActiveRecord::Base
  validates :fname, :presence => true
  validates :lname, :presence => true
  validates :is_active, :presence => true
  validates :is_admin, :presence => true
  validates :password, :presence => true
  validates :username, :presence => true, :uniqueness => true
  
  has_many :sections
end
