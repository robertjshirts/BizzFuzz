const {MongoClient} = require('mongodb')
const { v4: uuidv4 } = require('uuid')
const url = 'mongodb+srv://doadmin:51dzQ2863x0r7GST@bizz-fuzz-db-34ca5e5a.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=bizz-fuzz-db'

const userTable = 'test'
const quizTable = 'test'
const BizzFuzz = 'bizzfuzztest'

/**
 * Executes a MongoDB query.
 * @param {Function} query - The query to be executed against the database.
 */
const executeQuery = async (query, callback) => {
    const client = new MongoClient(url)
    try{
        const database = client.db(BizzFuzz)
        await query(database)
    } catch(err){
        if(err.code === 11000){
            callback(null, err.code)
        } else {
            callback(null, err)
        }
    } finally {
        client.close()
    }
}


/**
 * Creates a new document in the specified table.
 * @param {Object} data - The data to be inserted.
 * @param {string} table - The table (collection) in which to insert the data.
 * @param {Function} callback - Callback function to handle the result or err. (result, err)
 */
const create = async (data, table, callback) => {
    try{
        await executeQuery(async (database) =>{
            collection = database.collection(table)
            let newID = uuidv4()
            switch(table){
                case userTable:
                    data._id = "u" + newID
                    break
                case quizTable:
                    data._id = "q" + newID
                    break
            }
            data.dateCreated = Date.now()
            let result = await collection.insertOne(data)
            callback(result, null)
        }, callback)
    }catch(err){
        if(err === 11000){
            callback(null, err.code)
        } else {
            callback(null, err)
        }
    }
}

/**
 * Reads a single document from the specified table.
 * @param {Object} identifier - The query to identify the document to find.
 * @param {string} table - The table (collection) from which to read the document.
 * @param {Function} callback - Callback function to handle the result.
 */
const read = async (identifier, table, callback) => {
    await executeQuery(async (database) => {
        collection = database.collection(table)
        let result = await collection.findOne(identifier)
        callback(result, null)
    }, callback)
}

/**
 * Updates a document in the specified table.
 * @param {Object} identifier - The query to identify the document to update.
 * @param {Object} change - The changes to apply to the document.
 * @param {string} table - The table (collection) where the document resides.
 * @param {Function} callback - Callback function to handle the result.
 */
const update = async (identifier, change, table, updateType, callback) => {
    executeQuery(async (database) => {
        collection = database.collection(table)
        switch(updateType){
            case 1:
                updateChange = {
                    $set: {
                        ...change.$set
                    }
                }
                break
            case 2:
                updateChange = {
                    $push: {
                        ...change.$push
                    }
                }
                break
            case 3:
                updateChange = {
                    $pull: {
                        ...change.$pull
                    }
                }
                break
        }
        if (!updateChange.$set) {
            updateChange.$set = {};
        }
        updateChange.$set.lastUpdated = Date.now()
        let result = await collection.updateOne(identifier, updateChange)
        callback(result, null)
    }, callback)
}

/**
 * Removes a document from the specified table.
 * @param {Object} identifier - The query to identify the document to remove.
 * @param {string} table - The table (collection) from which to remove the document.
 * @param {Function} callback - Callback function to handle the result.
 */
const remove = async (identifier, table, callback) => { // called rmeoved because delete is a key word
    executeQuery(async (database) => {
        collection = database.collection(table)
        let result = await collection.deleteOne(identifier)
        callback(result, null)
    }, callback)
}

const search = (filter, numberOfItems, table, callback) => {
    executeQuery(async (database) => {
        collection = database.collection(table)
        let result = await collection.find(filter).limit(numberOfItems).toArray()
        console.log(result)
        callback(result, null)
    }, callback)
}

/**
 * Creates a new user.
 * @param {Object} userInfo - The information about the user to be created.
 * @param {Function} callback - Callback function to handle the result.
 */
const createUser = (userInfo, callback) => {   
    try{
        create(userInfo, userTable, callback)
    } catch(err) {
        if(err.code === 11000){
            callback(null, err.code)
        } else {
            callback(null, err)
        }
    }
}

/**
 * Searches the database for a user based on username
 * @param {string} username The username of the user you are looking for
 * @param {function} callback Callback function to handle the result and err. (result, err)
 */
const getUserByUsername = (username, callback) => {
    try{
        read({username}, userTable, callback)
    } catch(err) {
        callback(null, err)
    }
}

/**
 * Retrieves a user by their ID.
 * @param {string} _id - The ID of the user to retrieve.
 * @param {Function} callback - Callback function to handle the result.
 */
const getUser = (userID, callback) => {
    try{
        read({_id : userID}, userTable, callback)
    }catch(err){
        callback(null, err)
    }
}

/**
 * Deletes a user by their ID.
 * @param {string} _id - The ID of the user to delete.
 * @param {Function} callback - Callback function to handle the result.
 */
const deleteUser = (userID, callback) => {
    try{
        remove({_id : userID}, userTable, callback)
    } catch(err){
        callback(null, err)
    }
}

/**
 * Updates a user's information.
 * @param {string} _id - The ID of the user to update.
 * @param {Object} changeData - The changes to apply to the user's information.
 * @param {Function} callback - Callback function to handle the result.
 */
const updateUser = (userID, changeData, callback) => {
    try{
        updateData = {
            $set: changeData 
        }
        update({_id : userID}, updateData, userTable, 1, callback)
    } catch(err){
        callback(null, err)
    }
}

/**
 * Adds a qiuz to the quiz database
 * @param {Object} quizInfo The quiz object
 * @param {function} callback returns (result, err)
 */
const createQuiz = (quizInfo, userID, callback) => {
    try{
        create(quizInfo, quizTable, (result, err) => {
            if(err !== null){
                callback(null, err)
            } else {
                userChange = {createdQuizzes : result.insertedId}
                change = {$push : userChange}
                update({_id : userID}, change, userTable, 2, callback)
            }
        })
    } catch(err){
        callback(null, err)
    }
}

/**
 *  Stores the quiz that a suer took into the users profile
 * @param {string} _id The id of the user that took the quiz
 * @param {Object} quizResult The quiz results
 * @param {function} callback returns (result, err)
 */
const postQuiz = (userID, quizResult, callback) => {
    try{
        appendedData = {
            $push:{completedQuizzes: quizResult} 
        }
        update({_id : userID}, appendedData, userTable, 2, callback)
    } catch(err){
        callback(null, err)
    }
}

/**
 * Gets a single quiz from the quiz database
 * @param {string} quizID The id of the quiz you are looking fo rin the database
 * @param {function} callback callback function
 */
const getQuiz = (quizID, callback) => {
    try{
        read({_id : quizID}, quizTable, callback)
    } catch(err){
        callback(null, err)
    }
}

/**
 * uses given IDs to find an array of quizzes
 * @param {Array} quizIDs an array of quiz ids of the quizzes you want to find
 * @param {function} callback callback function
 */
const getQuizlets = (quizIDs, callback) => {
    try{
        search({_id : {$nin : quizIDs}}, 9, quizTable, callback)
    } catch(err){
        callback(null, err)
    }
}

/**
 * deletes a quiz from the database
 * @param {string} quizID The id of the quiz that you want to delete
 * @param {function} callback callback funciton
 */
const deleteQuiz = (quizID, userID, callback) => {
    try{
        remove({_id: quizID}, quizTable, (result, err) => {
            if(err !== null){
                callback(null, err)
            } else {
                change = { $pull: {createdQuizzes: quizID}}
                update({_id : userID}, change, userTable, 3, callback)
            }
        })
    } catch(err) {
        callback(null, err)
    }
}

const updateQuiz = (quizID, changeData, callback) => {
    try{
        updateData = {
            $set: changeData 
        }
        update({_id: quizID}, updateData, quizTable, callback)
    } catch(err) {
        callback(null, err)
    }
}

module.exports = {
    createUser: createUser,
    getUser: getUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getUserByUsername: getUserByUsername,
    createQuiz: createQuiz,
    postQuiz: postQuiz,
    getQuiz: getQuiz,
    getQuizlets: getQuizlets,
    deleteQuiz: deleteQuiz,
    updateQuiz: updateQuiz
}

