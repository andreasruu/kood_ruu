const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const axios = require('axios');
const app = express();
const port = 3000;

const db = new sqlite3.Database('database.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (username TEXT, password TEXT, firstName TEXT, lastName TEXT, age INTEGER, gender TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS feedback (username TEXT, message TEXT)");
});

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

function isAuthenticated(req, res, next) {
    if (req.session.isLoggedIn) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', (req, res) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            return res.send('An error occurred');
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            req.session.isLoggedIn = true;
            req.session.user = { username: username };
            res.redirect('/');
        } else {
            res.send('Invalid username or password');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { username, password, firstName, lastName, age, gender } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare("INSERT INTO users (username, password, firstName, lastName, age, gender) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(username, hashedPassword, firstName, lastName, age, gender, (err) => {
        if (err) {
            return res.send("An error occurred. User might already exist.");
        }
        res.redirect('/login');
    });
    stmt.finalize();
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/profile', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (user) {
            res.render('profile', { user: user });
        } else {
            res.send('User not found');
        }
    });
});

app.get('/home', (req, res) => {
    res.redirect('/');
});

app.get('/contact', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    db.all("SELECT message FROM feedback WHERE username = ?", [username], (err, feedback) => {
        if (err) {
            return res.send('An error occurred.');
        }
        res.render('contact', { user: req.session.user, feedback: feedback });
    });
});

app.post('/submit-feedback', isAuthenticated, (req, res) => {
    const { message } = req.body;
    const username = req.session.user.username;

    const stmt = db.prepare("INSERT INTO feedback (username, message) VALUES (?, ?)");
    stmt.run(username, message, function(err) {
        if (err) {
            console.error('Error submitting feedback:', err);
            return res.send("An error occurred while submitting feedback.");
        }
        res.redirect('/contact');
    });
    stmt.finalize();
});

app.get('/contact', isAuthenticated, (req, res) => {
    db.all("SELECT username, message FROM feedback", function(err, feedback) {
        if (err) {
            console.error('Error fetching feedback:', err);
            return res.send('An error occurred.');
        }
        res.render('contact', { user: req.session.user, feedback: feedback });
    });
});

app.get('/about', isAuthenticated, (req, res) => {
    res.render('about', { user: req.session.user });
});

app.get('/estonian-news', async (req, res) => {
    try {
        const response = await axios.get('https://newsdata.io/api/1/news', {
            params: {
                apiKey: 'pub_35929521c893c2142fb05e48c1b6d20178f75',
                country: 'ee', 
                language: 'et'
            }
        });

        const news = response.data.results;

        res.render('estonian-news', { user: req.session.user, news: news });
    } catch (error) {
        console.error('Error fetching Estonian news:', error);
        res.status(500).send('Error fetching news');
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});