import mongodb from 'mongodb'

function retreiveFromDatabase(url, database, collection, dataObj){
    return mongodb.MongoClient.connect(process.env.MONGODB_URI || url)
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
		 
}

console.log(retreiveFromDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', {userName:'testuser'}))