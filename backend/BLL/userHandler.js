
const bcrypt = require('bcryptjs');
const data = require('../data/data.js');

const errCodes = {
    101: {
        "err": "non unique username",
        "code": 101
    },
    102: {
        "err": "incorrect username/password",
        "code":102
    }
}
/**
 * @typedef {Object} UserJson
 * @property {string} username - The user's name
 * @property {string} password - The user's password
 */

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

/**
 * takes user data and checks the login username and password to the DAL stored data.
 * Returns a result if correct data(username,password) was sent
 * 
 * @param {UserJson} userJson the username and password in a json object
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const signUpUser = async (userJson, callback) => {

    userJson.password = await hashPassword(userJson.password)
    data.createUser(userJson, (result, err)=>{
        if(err === 11000){
            callback(null,errCodes[101])
        }
        let user = {
            "userId": result.insertedId,
            "username": userJson.username
        }
        callback(user,err)
    })

}

/**
 * Calls DAL user Craete and hashes user password
 * 
 * @param {UserJson} userJson
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const logInUser = (userJson, callback) =>{

    userStoredData = data.getUserByUsername(userJson.username, (result,err)=>{
        if(err){
            callback(null,err)
        }
        if(comparePasswords(userJson.password,result.password)){
            let user = {
                "userId": result._id,
                "username": result.username
            }
            callback(user,null)
        }else{
            callback(null,errCodes[102])
        }

    })

}


/**
 * sends new user data fields to the DAL
 * 
 * @param {Json} userJson _id, username
 * @param {Json} newData Json object that holds all fields that wish to be changed and the new values
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const updateUser = (userJson, newData, callback)=>{

    data.updateUser(userJson.userId,newData,(result,err)=>{
        if(err){
            callback(null,err)
        }
        callback(result,null)
    })

}

module.exports = {
   logIn: logInUser,
   signUp: signUpUser,
   updateUser: updateUser
}

