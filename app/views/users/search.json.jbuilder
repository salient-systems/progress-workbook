json.array!(@users) do |user|
  json.value user.fname + ' ' + user.lname
  json.id user.id
  json.tokens [user.fname, user.lname]
end