// This comment is a placehoder

const { userInfo } = require('os')
const dal = require('..\\backend\\data\\data.js')

const quiz = 
    {
        "_id": "q1dfc15f5-c38b-405a-b41c-0e68f3d8d79e",
        "name": "Personality Quiz",
        "description": "Discover your true self with this fun quiz!",
        "image": "base64_encoded_image_string",
        "creator": "user123",
        "questions": [
          {
            "prompt": "What is your favorite color?",
            "answers": [
              {
                "option": "Red",
                "result": 1,
                "weight": 5
              },
              {
                "option": "Blue",
                "result": 2,
                "weight": 5
              },
              {
                "option": "Green",
                "result": 3,
                "weight": 5
              },
              {
                "option": "Yellow",
                "result": 4,
                "weight": 5
              }
            ]
          },
          {
            "prompt": "What is your preferred season?",
            "answers": [
              {
                "option": "Spring",
                "result": 1,
                "weight": 5
              },
              {
                "option": "Summer",
                "result": 2,
                "weight": 5
              },
              {
                "option": "Fall",
                "result": 3,
                "weight": 5
              },
              {
                "option": "Winter",
                "result": 4,
                "weight": 5
              }
            ]
          }
        ],
        "results": [
          {
            "name": "Outcome 1",
            "description": "You are adventurous and outgoing!",
            "image": "base64_encoded_image_string"
          },
          {
            "name": "Outcome 2",
            "description": "You are calm and introspective!",
            "image": "base64_encoded_image_string"
          },
          {
            "name": "Outcome 3",
            "description": "You are energetic and social!",
            "image": "base64_encoded_image_string"
          },
          {
            "name": "Outcome 4",
            "description": "You are thoughtful and analytical!",
            "image": "base64_encoded_image_string"
          }
        ],
        "dateCreated": 1700865214971,
        "submissions": 1,
        "lastUpdated": 1701143446243
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


arrayOfQuiz = ['q9366e7dd-0fa2-4b68-9250-3eb03b1867f7','q9c33c0fd-56e5-4975-a067-4b3b974f7e3e']

//createUser(user)
//findUser("u98c7df55-afb6-40c3-b6d6-56e30c55799e")
//userTakesQuiz("u98c7df55-afb6-40c3-b6d6-56e30c55799e", quiz)
//createQuiz(quiz, 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//getQuiz("q992b90a9-5733-450f-bbe5-742f79bdd0a5")
getQuizlets(arrayOfQuiz, 2)
//deleteQuiz("uc8faa693-54ed-46ec-81f8-06bea4d86016", 'u07c309cd-3b32-4208-a5a5-0fd7eb494017')
//updateQuiz("qecd0f1d5-f16b-430e-a188-35f586fef15d")
//createUser(user)

