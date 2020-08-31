import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import mongodb from 'mongodb';


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

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka() // You can also use Express
	.get('/getit',(req,res)=> {
		res.end('hello')
	})
	.post('/getit',(req,res) => {
		console.log(req.body)
		res.end(JSON.stringify(req.body))
	})
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
