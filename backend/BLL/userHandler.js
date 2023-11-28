
const bcrypt = require('bcryptjs');
const data = require('../data/data.js');

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
    let isValid = bcrypt.compareSync(testPassword, storedPassword)
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
        if(err){
            callback(null,err)
            return;
        }
        else{
        let user = {
            "userId": result.insertedId,
            "username": userJson.username
        }
        callback(user,null)
    }
    })

}

/**
 * Calls DAL user Craete and hashes user password
 * 
 * @param {UserJson} userJson the username and the password
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const logInUser = (userJson, callback) =>{

    userStoredData = data.getUserByUsername(userJson.username, async (result,err)=>{
        if(err){
            callback(null,err)
            return;
        }
        let comp = await comparePasswords(userJson.password,result.password)
        //console.log(comp)
        if(comp){
            let user = {
                "userId": result._id,
                "username": result.username
            }
            callback(user,null)
            return;
        }else{
            callback(null,'wrong username/password')
        }

    })

}


/**
 * returns the entire user object with the specified user ID
 * 
 * @param {String} userId the id of the user object that is to be returned
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const getUserData = (userId, callback) => {

    userData = data.getUser(userId, (result, err) => {
        if (err) {
            callback(null, (err))
            return;
        }
        delete result.password
        
        callback(result, null)
    })

}

/**
 * sends new user data fields to the DAL
 * 
 * @param {String} userId _id of the user to be updated
 * @param {Json} newData Json object that holds all fields that wish to be changed and the new values
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const updateUser = async (userId, newData, callback)=>{
    if(newData.password){
        newData.password = await hashPassword(newData.password)
    }
    data.updateUser(userId,newData, (result,err)=>{
        
        if(err){
            callback(null,err)
            return;
        }
        callback(result,null)
    })

}


/**
 * deletes a user based off of thier id
 * 
 * @param {String} UserId the id of the user object that is to be deleted
 * @param {function(result,err)} callback passed function to handle the result and error outcome
 */
const deleteUser = (UserId, callback)=>{
    data.deleteUser(UserId,(result,err)=>{
        if(err){
            callback(null,(err))
            return;
        }
        callback(result,null)
    })

}


module.exports = {
   logIn: logInUser,
   signUp: signUpUser,
   updateUser: updateUser,
   deleteUser: deleteUser,
   getUserData: getUserData
}

