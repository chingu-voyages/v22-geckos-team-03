const express = require('express')
const app = express()
const path = require('path')
const MongoClient = require('mongodb').MongoClient
const uri = 
	`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}
	@cluster0-vo8rx.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;




const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

