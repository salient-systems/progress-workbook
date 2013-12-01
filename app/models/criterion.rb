class Criterion < ActiveRecord::Base
  validates :name, :presence => true
  validates :max, :presence => true

  belongs_to :assessment

  has_many :criterion_grades, dependent: :destroy
end
