class Term < ActiveRecord::Base
  has_many :sections, dependent: :destroy
end
