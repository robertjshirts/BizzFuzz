const {MongoClient} = require('mongodb')
const url = 'mongodb+srv://doadmin:51dzQ2863x0r7GST@bizz-fuzz-db-34ca5e5a.mongo.ondigitalocean.com/admin?tls=true&authSource=admin&replicaSet=bizz-fuzz-db'

/** 
* Exexutes a given query in a client 
* @param {String} query The query for the mongo database */

const executeQuery = async (query) => {
    const client = MongoClient(url)
    try{
        await query(client)
    } catch(err){
        console.log('Error in data.js ln: 9 err= ' + err)
    } finally {
        await client.close()
    }
}

