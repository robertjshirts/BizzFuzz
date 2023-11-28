
const data = require('../data/data.js');
const users = require('./userHandler.js');

/**
 * takes the user Id and returns up to 9 new quizlets in an array
 * 
 * @param {String} UserId the id of the user object that is to be deleted
 * @param {function(result,err)} callback passed function to handle the result and error outcome (result = [array of quizlets])
 */
const getNewQuizzes = async (userId, callback) => {

    users.getUserData(userId, (result, err) => {
        if(err){
            callback(null,err)
        }else{
        if (result['completedQuizzes'] && result.completedQuizzes.length > 0) {
            let quizIds = []
            //console.log(result.completedQuizzes)
            Array.prototype.forEach.call(result.completedQuizzes, (element) => {
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
            data.getQuizlets([], (result, err) => {
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
    }
    })

}

/**
 * deletes a quiz that a user has created using the userid and the quizid
 * 
 * @param {String} userId the id of the user that created the quiz
 * @param {String} quizId the id of the quiz that is to be deleted
 * @param {function(result, err)} callback result = {acknowledged:BOOLEAN , deletedCount:INT}
 */
const deleteUserQuiz = (userId, quizId, callback) => {
    // the user id is for if we add quizzes to the user object if we decide against it I will remove it
    data.deleteQuiz(quizId, (result,err)=>{
        callback(result,err)
    })
}

/**
 * add quiz result data to the user object
 * 
 * @param {String} userId the id of the user that took the quiz
 * @param {JSON} resutlObj the result obj of the quiz completed by the user
 * @param {function(result, err)} callback result = {
  acknowledged: BOOLEAN,
  modifiedCount: INT,
  upsertedId: null,
  upsertedCount: INT,
  matchedCount: INT
}
 */
const postUserQuizResults = (userId,resultObj, callback) =>{
    data.postQuiz(userId,resultObj,(result,err)=>{
        if(err){
            callback(null,err)
        }else{
            callback(result,err)
        }
    })
    data.getQuiz(resultObj.quizId, (result,err)=>{
        data.updateQuiz(result._id,{submissions: (result.submissions+1)},(result,err)=>{
            if(err){
                console.log(err)
            }
        })
    })
}

/**
 * creates a quiz and adds the quiz to the user object and the quiz DB
 * 
 * @param {*} userId the id of the user that created the quiz
 * @param {*} quizInfo the full quiz object 
 * @param {function(result,err)} callback result =
 */
const createQuiz = (userId, quizInfo, callback) =>{
    quizInfo.submissions = 0;
    data.createQuiz(quizInfo,userId,(result,err)=>{
        if(err){
            callback(null,err)
        }else{
            callback(result,err)
        }
    })
}

/**
 * returns a quiz by ID
 * 
 * @param {String} quizId the id of the quiz to be recieved
 * @param {function(result,err)} callback result=quizObj
 */
const getQuiz = (quizId,callback)=> {
    data.getQuiz(quizId,(result,err)=>{
        callback(result,err)
    })
}

module.exports = {
    getNewQuizzes: getNewQuizzes,
    deleteUserQuiz: deleteUserQuiz,
    postUserQuizResults: postUserQuizResults,
    createQuiz: createQuiz,
    getQuiz: getQuiz
}