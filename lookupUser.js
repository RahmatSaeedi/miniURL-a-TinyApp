module.exports = {
  lookupUser : (email, password, users) => {
    for (let user in users) {
      if (users[user].email === email) {
        if (password !== null) {
          if (users[user].password === password) {
            return users[user].id;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    }
    return false;
  }
};