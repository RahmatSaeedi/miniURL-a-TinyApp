const database = {
  g : {
    longURL : "https://www.google.ca",
    userID : "test1"
  },
  LH : {
    longURL : "https://www.lighthouselabs.ca",
    userID : "test1"
  },
  e : {
    longURL : "https://www.example.com",
    userID : "someoneelse"
  }
};

const addURL = (shortCode, longURL, userID) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  longURL = typeof(longURL) === 'string' ? longURL : undefined;
  userID = typeof(userID) === 'string' ? userID : undefined;

  if (shortCode && longURL && userID) {
    database[shortCode] = {
      longURL,
      userID
    };
    return true;
  } else {
    return false;
  }
};

const removeURL = (shortCode, userID) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  userID = typeof(userID) === 'string' ? userID : undefined;
  let owner = typeof(database[shortCode].userID) === 'string' ? database[shortCode].userID : 'unknownOwner';

  if (shortCode && userID === owner) {
    return delete database[shortCode];
  } else {
    return false;
  }
};

const getURL = (shortCode) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  if (shortCode && database[shortCode]) {
    return database[shortCode];
  } else {
    return false;
  }
};
const updateURL = (shortCode, longURL, userID) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  longURL = typeof(longURL) === 'string' ? longURL : undefined;
  userID = typeof(userID) === 'string' ? userID : undefined;
  let owner = typeof(database[shortCode].userID) === 'string' ? database[shortCode].userID : 'unknownOwner';

  if (shortCode && longURL && userID && userID === owner) {
    database[shortCode].longURL = longURL;
    return true;
  } else {
    return false;
  }
};

module.exports = {
  addURL,
  removeURL,
  updateURL,
  getURL
};