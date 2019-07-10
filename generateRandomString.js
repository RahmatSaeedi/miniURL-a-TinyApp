
module.exports = {
  generateRandomString: () => {
    let array = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randString = '';
    
    randString += array[Math.floor(Math.random() * array.length)];
    array += "0123456789";

    while (randString.length < 7) {
      randString += array[Math.floor(Math.random() * array.length)];
    }
    
    return randString;
  }
};