class Term < ActiveRecord::Base
  belongs_to :sections, dependent: :destroy
end
