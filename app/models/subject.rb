class Subject < ActiveRecord::Base
    validates :name, :presence => true, :uniqueness => true

    has_many :sections, dependent: :destroy
end
