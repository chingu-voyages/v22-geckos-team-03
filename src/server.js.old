require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-vo8rx.mongodb.net/${process.env.MONGO_DBNAME}?retryWrites=true&w=majority`;
console.log(uri)
mongoose.Promise = Promise
/*
mongoose.connect(dbUrl, { useNewUrlParser: true}, err => {
    console.log('mongo db connection', err)
})
*/

mongoose.connect(uri)
	.then(db => {
		console.log(`Mongoose connection successful to host: ${db.connections[0].host} on port: ${db.connections[0].port}`)
	})
	.catch(dbErr => {
		console.log('DB Connection Error:', dbErr.message)
		process.exit(1)
	})


const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}.`);
});

