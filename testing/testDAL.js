// This comment is a placehoder

const { userInfo } = require('os')
const dal = require('..\\backend\\data\\data.js')



const user = {
    "username" : "TestUser",
    "password" : "password123"
}

const findUser = (id) => {
    dal.getUser(id, (result, err) => {
        if(err !== null){
            console.log("Something went wrong")
        } else {
            console.log(result)
        }
    })
}

const userTakesQuiz = (id, quizInfo) => {
    dal.createResult(id, quizInfo, (result, err) => {
        if(err !== null){
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

const getQuizlets = (quizIDs, pageNumber) => {
    dal.getQuizlets(quizIDs, pageNumber, (result, err) => {
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

const search = (searchTerm) => {
    dal.search(searchTerm, 9, 1, 'MOST POPULAR', (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const updateResult = (userID, quizID) => {
    change = {
            name : "Robbie's Testies",
            description: "You wouldn't believe what this means"
        }
    dal.updateResult(userID, quizID, change, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const readResult = (userID, quizID) => {
    dal.readResult(userID, quizID, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}

const deleteResult = (userID) => {
    dal.deleteResult(userID, (result, err) => {
        if(err !== null){
            console.log(err)
        } else {
            console.log(result)
        }
    })
}


arrayOfQuiz = ['q9366e7dd-0fa2-4b68-9250-3eb03b1867f7','q9c33c0fd-56e5-4975-a067-4b3b974f7e3e']

//createUser(user)
//findUser("ud0382936-d4af-447f-b2a8-e110b4d9e7ee")
//userTakesQuiz("u98c7df55-afb6-40c3-b6d6-56e30c55799e", quiz)
//createQuiz(quiz, 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//getQuiz("qe0cb6ef5-5e4f-4765-9e25-45d32ec50ecd")
//getQuizlets(arrayOfQuiz, 2)
//deleteQuiz("uc8faa693-54ed-46ec-81f8-06bea4d86016", 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//updateQuiz("qecd0f1d5-f16b-430e-a188-35f586fef15d")
//createUser(user)
search('movie quiz')
//updateResult("ud0382936-d4af-447f-b2a8-e110b4d9e7ee", "q359457c6-ae63-4607-9eed-4850c532a298")
//readResult("ud0382936-d4af-447f-b2a8-e110b4d9e7ee", "q359457c6-ae63-4607-9eed-4850c532a298")
//deleteResult('u91df3a75-20c8-4789-be46-63abfbf1bc81')


