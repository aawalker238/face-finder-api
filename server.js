const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'aawalker238',
    password: '',
    database: 'face-finder'
  }
});

/********** ROUTES ********** 
  /                 --> GET   = 
  /signin           --> POST  = success/fail
  /register         --> POST  = user
  /profile/:userId  --> GET   = user
  /image            --> PUT   = user
****************************/

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db));

app.post('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

// BCRYPT
bcrypt.hash('bacon', null, null, function(err, hash) {
  // Store hash in your password DB.
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
