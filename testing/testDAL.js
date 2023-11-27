// This comment is a placehoder

const { userInfo } = require('os')
const dal = require('..\\backend\\data\\data.js')

const quiz = {
    "quizName" : "Test Quiz",
    "description" : "This is a test quiz!"
}

const user = {
    "username" : "TestUser",
    "password" : "password123"
}

const findUser = (id) => {
    dal.getUser(id, (result, err) => {
        if(err != null){
            console.log("Something went wrong")
        } else {
            console.log(result)
        }
    })
}

const userTakesQuiz = (id, quizInfo) => {
    dal.postQuiz(id, quizInfo, (result, err) => {
        if(err != null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const createQuiz = (quizData, userID) => {
    dal.createQuiz(quizData, userID,  (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const getQuiz = (quizID) => {
    dal.getQuiz(quizID, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const getQuizlets = (quizIDs) => {
    dal.getQuizlets(quizIDs, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const deleteQuiz = (quizID) => {
    dal.deleteQuiz(quizID, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const updateQuiz = (quizID) => {
    change = {quizName : "New Quiz Name"}
    dal.updateQuiz(quizID, change, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const createUser = (userInfo) => {
    dal.createUser(userInfo, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

arrayOfQuiz = ['q9366e7dd-0fa2-4b68-9250-3eb03b1867f7','q9c33c0fd-56e5-4975-a067-4b3b974f7e3e']

//findUser("u98c7df55-afb6-40c3-b6d6-56e30c55799e")
//userTakesQuiz("u98c7df55-afb6-40c3-b6d6-56e30c55799e", quiz)
createQuiz(quiz, 'u9298fac1-e465-4a2f-a49d-09ca70f6a337')
//getQuiz("q992b90a9-5733-450f-bbe5-742f79bdd0a5")
//getQuizlets(arrayOfQuiz)
//deleteQuiz("q992b90a9-5733-450f-bbe5-742f79bdd0a5")
//updateQuiz("qecd0f1d5-f16b-430e-a188-35f586fef15d")
//createUser(user)

