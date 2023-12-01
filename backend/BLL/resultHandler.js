const data = require('../data/data.js');
const users = require('./userHandler.js');
const quizes = require('./quizHandler.js')



/**
 * Posts a result for a user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {object} resultObj - The result object to be posted before result calculation.
 * @param {function(result, err)} callback - The callback function to handle the result or error.
 */
const postResult = (userId, resultObj, callback) => {



}

/**
 * Deletes a result for a user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} resultId - The unique identifier of the result to be deleted.
 * @param {function(result, err)} callback - The callback function to handle the result or error.
 */
const deleteResult = (userId, resultId, callback) => {



}

/**
 * Updates a result for a user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} resultId - The unique identifier of the result to be updated.
 * @param {object} resultChanges - a json obj that holds only the data to be changed 
 * @param {function(result, err)} callback - The callback function to handle the updated result or error.
 */
const updateResult = (userId, resultId, resultChanges, callback) => {



}

/**
 * Gets a result for a user and quiz.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} quizId - The unique identifier of the quiz for which to retrieve the result.
 * @param {function(result, err)} callback - The callback function to handle the get result or error.
 */
const getResult = (userId, quizId, callback) => {



}
