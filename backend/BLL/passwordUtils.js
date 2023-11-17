
const bcrypt = require('bcryptjs');

/**
 * uses bcrypt to add a 10 digit salt to the user password
 * 
 * @param {String} password un hashed user password 
 * @returns the hashed and salted password
 */
async function hashPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password,salt);
    return hash;
  }

/**
 * uses bcrypt to compare a new (unhashed) password to a hashed password
 * 
 * @param {String} testPassword an unhashed password that needs to be checked against the stored password
 * @param {Hash} storedPassword the hashed password stored in the database
 * @returns boolean showing true if both passwords match
 */
async function comparePasswords(testPassword, storedPassword){
    let isValid = bcrypt.compareSync(storedPassword, testPassword)
    return isValid
}

module.exports = {
    hashPassword,
    comparePasswords
}

