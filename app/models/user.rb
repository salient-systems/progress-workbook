class User < ActiveRecord::Base
  validates :fname, :presence => true
  validates :lname, :presence => true
  validates :password, :presence => true
  validates :username, :presence => true, :uniqueness => true

  has_many :sections, dependent: :destroy
  has_many :students, through: :sections
  has_many :criterion_grade
end
