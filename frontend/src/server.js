if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}
import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import mongodb from 'mongodb';
import bodyParser from 'body-parser'
const bcrypt = require('bcrypt')
import initialize from './passport-config'
import passport from 'passport'
const flash = require('express-flash')
const session = require('express-session')

function getUserFromEmail(email){
	mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
								{ useNewUrlParser: true }, (err, client) => { 
									if(err) return console.log(err)
									return client.db('chat-app').collection('User').findOne({email: email})
								})
}
function getUserFromId(id){
	mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
								{ useNewUrlParser: true }, (err, client) => { 
									if(err) return console.log(err)
									return client.db('chat-app').collection('User').findOne({id: id})
								})
								
}
initialize(passport, 
	email => getUserFromEmail(email),
	id => getUserFromId(id)
)


/*
const MongoClient = mongodb.MongoClient
const mongoURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const dbName = 'chat-app'
let db = null

MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {
    if(err) return console.log(err)
    db = client.db(dbName)
    console.log(`Connected MongoDB: ${mongoURL}`)
    console.log(`Database: ${dbName}`)
})
*/

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(flash())
	.use(session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	}))
	.use(passport.initialize())
	.use(passport.session())
	.get('/getit',(req,res)=> {
		res.end('hello')
	})
	.post('/registerUser', async (req,res) => {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10)
			
				const userObj = {
					id: Date.now().toString(),
					userName: req.body.userName,
					email: req.body.email,
					password: hashedPassword
				}
				
				mongodb.MongoClient.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
											{ useNewUrlParser: true }, (err, client) => { 
												if(err) return console.log(err)
												client.db('chat-app').collection('User').insertOne(userObj)
					//db = client.db(dbName)
					//console.log(`Connected MongoDB: ${mongoURL}`)
					//console.log(`Database: ${dbName}`)
					//db.collection('User').insert(userObj)
											})
											
			//res.end('user registered')
			res.redirect('/login')
		}
		catch {
			res.redirect('/register')
			//res.end('error')
		}
		/*
		.post('/registerUser', async (req,res) => {
			try {

				
				const MongoClient = mongodb.MongoClient
				const mongoURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
				const dbName = 'chat-app'
				let db = null
				MongoClient.connect(mongoURL, { useNewUrlParser: true }, (err, client) => {
					if(err) return console.log(err)
					db = client.db(dbName)
					console.log(`Connected MongoDB: ${mongoURL}`)
					console.log(`Database: ${dbName}`)
					db.collection('User').insert(userObj)
				})
			} catch {
				res.end('error')
			}
			console.log(req.body)
			res.end(JSON.stringify(req.body))
		})
		*/
	})
	.post('/login',passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	},
	(req,res) => {res.json({userName: req.user.userName, email: req.user.email })})) 
	/*
	passport.authenticate('local',{
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}))
	*/
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
