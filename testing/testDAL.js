// This comment is a placehoder

const dal = require('..\\backend\\data\\data.js')

const quiz = {
    "quizName" : "Test Quiz",
    "description" : "This is a test quiz!"
}

const user = {
    "username": "Bob",
    "password": "password123"
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
    dal.createQuiz(quizData, userID, (result, err) => {
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

const deleteQuiz = (quizID, userID) => {
    dal.deleteQuiz(quizID, userID, (result, err) => {
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

//createUser(user)
//findUser("u98c7df55-afb6-40c3-b6d6-56e30c55799e")
//userTakesQuiz("u98c7df55-afb6-40c3-b6d6-56e30c55799e", quiz)
//createQuiz(quiz, 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//getQuiz("q992b90a9-5733-450f-bbe5-742f79bdd0a5")
//getQuizlets(arrayOfQuiz)
deleteQuiz("uc8faa693-54ed-46ec-81f8-06bea4d86016", 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//updateQuiz("qecd0f1d5-f16b-430e-a188-35f586fef15d")

