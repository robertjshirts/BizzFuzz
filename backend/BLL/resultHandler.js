const data = require('../data/data.js');
const users = require('./userHandler.js');
const quizzes = require('./quizHandler.js')



/**
 * Posts a result for a user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} quizId - The id of the quiz that was completed
 * @param {object} resultArrayObj- The result object to be posted.
 * @param {function(result, err)} callback - The callback function to handle the result or error.
 */
const postResult = (userId, quizId, resultArrayObj, callback) => {

    quiz = quizzes.getQuiz(quizId, async (result, err) => {
        try {
            let resultArray = [0, 0, 0, 0]

            await resultArrayObj.forEach(element => {
                resultArray[element.result] += parseInt(element.weight)
            });
            console.log(resultArray)

            max = Math.max(...resultArray)
            outcome = resultArray.findIndex(x => x===max)

            finalResult = result.results[outcome]
            finalResult.quizId = quizId

            if(userId === -1){
                callback(finalResult, err)
            }else{
                data.createResult(userId, finalResult, (result, err) => {
                    callback(finalResult, err)
                })
            }


        } catch (error) {
            callback(null, error)
        }
    })

}

/**
 * Deletes a result for a user.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} quizId - The unique identifier of the result to be deleted.
 * @param {function(result, err)} callback - The callback function to handle the result or error.
 */
const deleteResult = (userId, quizId, callback) => {
    data.deleteResult(userId, (result,err)=>{
        callback(result, err)
    })
}

/**
 * Gets a result for a user and quiz.
 *
 * @param {string} userId - The unique identifier of the user.
 * @param {string} quizId - The unique identifier of the quiz for which to retrieve the result.
 * @param {function(result, err)} callback - The callback function to handle the get result or error.
 */
const getResult = (userId, quizId, callback) => {

    data.readResult(userId,quizId, (result,err)=>{
        callback(result, err)
    })

}



module.exports = {
    postResult: postResult,
    getResult: getResult,
    deleteResult: deleteResult
}