const express = require('express');
const app = express();
var http = require('http').Server(app);
app.use(express.static(__dirname + '/'));
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const { check, validationResult, body } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

//connect to db with knex query builder
var knex = require('knex')({
	client: 'pg',
	connection: {
	  host : 'localhost',
	  user : 'postgres',
	  password : 'postgres',
	  database : 'records'
	},
});

app.get('/', (req, res) => {
  res.sendFile('/views/index.html', {root: __dirname});
})

const selectQuery = () => knex('users');
app.get('/data', (req, res) => {
  selectQuery().then(data => {
    res.json(data);
  })
})

app.post('/add', [
	body(['fname', 'age', 'phone', 'location']).not().isEmpty(),
	body('email').isEmail()
], (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.mapped());
		return res.sendStatus(400);
	}
	const data = matchedData(req);
	const insertQuery = knex('users').insert([{name: data.fname, age: data.age, phone: data.phone, email: data.email, location: data.location}]).then(() => res.end())
	insertQuery.catch(err => console.log(err))
})

app.post('/delete', (req, res) => {
	const data = req.body.data;
	console.log("id: " + data + " was deleted");
	const deleteQuery = knex('users').where('id', data).del().then(() => res.end())
	deleteQuery.catch(err => console.log(err))
})

http.listen(8000, () => console.log("listening on port 8000..."))