if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}
import sirv from 'sirv'
import polka from 'polka'
import compression from 'compression'
import * as sapper from '@sapper/server'
import mongodb from 'mongodb'
import bodyParser from 'body-parser'
const bcrypt = require('bcrypt')
//import initialize from './passport-config'
import passport from 'passport'
const flash = require('express-flash')
const session = require('express-session')
const { PORT, NODE_ENV } = process.env
const dev = NODE_ENV === 'development'
const LocalStrategy = require('passport-local').Strategy

const local = new LocalStrategy(
	function(username, password, done) {
		let user = retriveFromDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', { userName: username })
		if(!user){
			return done(null, false, {message: 'Incorrect username' })
		}
		else {
			let passwordMatch = bcrypt.compare(password, user.password, (err, isMatch) => {
				if(err){return false}
				return isMatch
			})

			if(passwordMatch) {
				return done(null, user)
			}
			else {
				return done(null, false, { message: 'Incorrect password' })
			}
		}
	}
)


function addToDatabase(url, database,collection, dataObj) {
	mongodb.MongoClient.connect(process.env.MONGODB_URI || url,
								{ useNewUrlParser: true }, (err, client) => { 
									if(err) return console.log(err)
									return client.db(database).collection(collection).insertOne(dataObj)
								})
}

function retriveFromDatabase(url, database, collection, dataObj) {
	mongodb.MongoClient.connect(process.env.MONGODB_URI || url,
		{ useNewUrlParser: true }, (err, client) => { 
			if(err) return console.log(err)
			return client.db(database).collection(collection).findOne(dataObj)
		})
}
/*
initialize(passport, 
	email => retriveFromDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', { email: email }),
	id => retriveFromDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', { id: id })
)
*/

passport.use(local)

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
	.post('/registerUser', async (req,res) => {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10)
			
			const userObj = {
				id: Date.now().toString(),
				userName: req.body.userName,
				email: req.body.email,
				password: hashedPassword
			}
			addToDatabase('mongodb://127.0.0.1:27017', 'chat-app', 'User', userObj)
											
			res.end('user registered')
			//res.redirect('/login')
		}
		catch(error) {
			//res.redirect('/register')
			res.end('error')
		}
		
	})
	.post('/login',passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	},
	(req,res) => {res.json({userName: req.user.userName, email: req.user.email })})) 
	.post('/message', async (req,res) => {
		try{
			const messageObj = {
				id: Date.now().toString(),
				userId: req.body.userId,
				userName: req.body.userName,
				message: req.body.message
			}

			addToDatabase('mongodb://127.0.0.1:27017', 'chat-app','Message', messageObj)
			res.end('hello')
		}
		catch {
			res.end('error')
		}
	})
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
		