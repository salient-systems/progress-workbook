json.array!(@users) do |user|
  json.extract! user, :username, :fname, :lname, :is_active, :is_admin, :password
  json.url user_url(user, format: :json)
end
