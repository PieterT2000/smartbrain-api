// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//require routes
const register = require('./controllers/register'),
	signin = require('./controllers/signin'),
	profile = require('./controllers/profile'),
	image = require('./controllers/image');

//set up postgreSQL with knex
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => {
	register.handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
	profile.handleProfileGet(req, res, db);
});

app.put('/image', (req, res) => {
	image.handleImage(req, res, db);
});

app.post('/imageurl', (req, res) => {
	image.handleApiCall(req, res);
});

// app.get('*', (req, res) => {
// 	res.send('Nothing interesting to do here! Go seek elsewhere :)');
// });

const PORT = process.env.PORT;
app.listen(PORT || 3001, () => {
	console.log(`Cheers, you're server is running on port ${PORT || 3001}`);
});
