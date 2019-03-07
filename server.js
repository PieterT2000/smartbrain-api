const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

//set up postgreSQL with knex
const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: 'local',
		database: 'smart-brain'
	}
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
};

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	bcrypt.compare('apples', '$2a$10$XUjuiCkyAXPVXQsXIOdNpewEAUgyKQpr8L8MxuOfqj/0hszc9uxo6', function(err, res) {
		console.log('first guess', res);
	});
	bcrypt.compare('bacon', '$2a$10$XUjuiCkyAXPVXQsXIOdNpewEAUgyKQpr8L8MxuOfqj/0hszc9uxo6', function(err, res) {
		console.log('first guess', res);
	});
	if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, null, null, function(err, hash) {
		// Store hash in your password DB.
		console.log(hash);
	});
	db('users')
		.returning('*')
		.insert({
			email,
			name,
			joined: new Date()
		})
		.then((user) => {
			res.json(user[0]);
		})
		.catch((err) => res.status(400).json('unable to register'));
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db
		.select('*')
		.from('users')
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch((err) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(400).json('unable to get entries'));
});

app.listen(3001, () => {
	console.log("Cheers, you're server is running on port 3001");
});
