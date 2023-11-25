
const data = require('../data/data.js');
const users = require('./userHandler.js');

/**
 * takes the user Id and returns up to 9 new quizlets in an array
 * 
 * @param {String} UserId the id of the user object that is to be deleted
 * @param {function(result,err)} callback passed function to handle the result and error outcome (result = array of quizzes)
 */
const getNewQuizzes = async (userId, callback) => {

    users.getUserData(userId, (result, err) => {
        if (result.completedQuizes) {
            let quizIds = []
            result.completedQuizes.forEach(element => {
                quizIds.push(element.quizId)
            });
            try {
                data.getQuizlets(quizIds, (result, err) => {
                    try {
                        let quizlets = []
                        result.forEach(element => {
                            let quizlet = {
                                "id": element._id,
                                "name": element.name,
                                "description": element.description,
                                "dateCreated": element.dateCreated,
                                "image": element.image,
                                "creator": element.creator,
                                "submissions": element.submissions
                            }
                            quizlets.push(quizlet)
                        })
                        callback(quizlets, err)
                        return;
                    } catch (err) {
                        callback(null, err)
                        return;
                    }
                })
            } catch (err) {
                callback(null, err)
            }
        } else {
            data.getQuizlets(['1'], (result, err) => {
                try {
                    let quizlets = []
                    result.forEach(element => {
                        let quizlet = {
                            "id": element._id,
                            "name": element.name,
                            "description": element.description,
                            "dateCreated": element.dateCreated,
                            "image": element.image,
                            "creator": element.creator,
                            "submissions": element.submissions
                        }
                        quizlets.push(quizlet)
                    })
                    callback(quizlets, err)
                    return;
                } catch (err) {
                    callback(null, err)
                    return;
                }
            })
        }
    })

}

/**
 * deletes a quiz that a user has created using the userid and the quizid
 * 
 * @param {String} userId the id of the user that created the quiz
 * @param {String} quizId the id of the quiz that is to be deleted
 * @param {callback(result, err)} callback result = {acknowledged:BOOLEAN , deletedCount:INT}
 */
const deleteUserQuiz = (userId, quizId, callback) => {
    data.deleteQuiz(quizId, (result,err)=>{
        callback(result,err)
    })
}



module.exports = {
    getNewQuizzes: getNewQuizzes,
    deleteUserQuiz: deleteUserQuiz
}

