const mongodb = require('mongodb')
async function ClientConnection() {
    async function findUser() {
        const connection = await mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', { useUnifiedTopology: true })
        const db = connection.db('chat-app')
        const col = db.collection('User')
        const user = await col.findOne({userName: 'testuser'})
        return user
    }
    const user = await findUser()
    return user
    //const connection = await mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', { useUnifiedTopology: true })
    //const db = connection.db('chat-app')
    //const col = db.collection('User')
    //const user = await col.findOne({userName: 'testuser'})
    //return user
}
let founduser = ClientConnection()
console.log(founduser)
/*
async function retreiveFromDatabase(url, database, collection, dataObj){
    return await mongodb.MongoClient.connect(process.env.MONGODB_URI || url)
        .then((client) => console.log(client.db(database)))
        .catch(error => console.log(error)) 
    /*   
	mongodb.MongoClient.connect(process.env.MONGODB_URI || url,
		{ useNewUrlParser: true }, (err, client) => {
            
			if (err)
				return console.log(err)
           client.db(database).collection(collection).findOne(dataObj).then(userfound => user = userfound)
            
        })
        return user
        */
		 


//console.log(retreiveFromDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', {userName:'testuser'}))