const dal = require('.\\data.js')

let user = {
    "username" : "TestingGuy",
    "password" : "password123",
}

let quiz = {
    "name" : "TestQuiz",
    "description" : ""
}


/* 
{
    "id": "String",
    "name": "String",
    "description": "String",
    "dateCreated": "String(mm/dd/yyyy)",
    "image": "Serialized String",
    "creator": "id(String)",
    "questions":[
        {
            "prompt": "String",
            "answers":[
                {
                    "option": "String(a)",
                    "result": 1,
                    "weight": 5
                },
                {
                    "option": "String(b)",
                    "result": 1,
                    "weight": 5
                },
                {
                    "option": "String(c)",
                    "result": 1,
                    "weight": 5
                },
                {
                    "option": "String(d)",
                    "result": 1,
                    "weight": 5
                }
            ]
        }
    ],
    "results":[
        {
            "name": "String(outcome 1)",
            "description": "String",
            "image": "Serialized String"
        },
        {
            "name": "String(outcome 2)",
            "description": "String",
            "image": "Serialized String"
        },
        {
            "name": "String(outcome 3)",
            "description": "String",
            "image": "Serialized String"
        },
        {
            "name": "String(outcome 4)",
            "description": "String",
            "image": "Serialized String"
        }
    ]
}
*/

/*{
    "id": "String",
    "username": "String",
    "password": "String",
    "dateCreated": "String(mm/dd/yyyy)",
    "image": "Serialized String",
    "completedQuizes":[
        {
            "quizId": "String",
            "dateTaken": "String(mm/dd/yyyy)",
            "result":{
                "name": "String",
                "description": "String"
            }
        }
    ]
}
*/

const add = () => {
    let answer = 1+1
}

const catchingErr = (err) =>{
    console.log(err)
}

const testCreate = (userData) => {
    dal.createUser(userData, (result, err) => {
        if (err === 11000){
            console.log("this worked")
        } else {
            console.log("not working")
        }
    })
}

const testDelete = (_id) => {
    dal.deleteUser(_id, add)
}

const logging = (result) => {
    console.log(result)
}

const testUpdate = (_id) => {
    let changeData = {password : "newPassword"}
    dal.updateUser(_id, changeData, logging)
}

const testRead = (_id) => {
    dal.getUser(_id, logging)
}

const testCreateQuiz = (quizData) => {
    dal.createQuiz(quizData, logging)
}

testCreate(user)
//testDelete("u0ab65eb4-ced6-4021-a16b-df3a794bfe0c")
//testUpdate("u98c7df55-afb6-40c3-b6d6-56e30c55799e")
//testRead("u0ab65eb4-ced6-4021-a16b-df3a794bfe0c")
//testCreateQuiz()