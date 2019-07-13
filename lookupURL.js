const database = {
  g : {
    longURL : "https://www.google.ca",
    userID : "test1",
    'visits' : 10
  },
  LH : {
    longURL : "https://www.lighthouselabs.ca",
    userID : "test1",
    'visits' : 10
  },
  e : {
    longURL : "https://www.example.com",
    userID : "someoneelse",
    'visits' : 10
  }
};

const addURL = (shortCode, longURL, userID) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  longURL = typeof(longURL) === 'string' ? longURL : undefined;
  userID = typeof(userID) === 'string' ? userID : undefined;

  if (shortCode && longURL && userID) {
    database[shortCode] = {
      longURL,
      userID,
      'visits' : 0
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

const getURL = (shortCode, increment = false) => {
  shortCode = typeof(shortCode) === 'string' ? shortCode : undefined;
  increment = typeof(increment) === 'boolean' ? increment : false;

  if (shortCode && database[shortCode]) {
    if (increment) {
      database[shortCode].visits += 1;
    }
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