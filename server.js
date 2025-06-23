/*const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
const users = {}; // In-memory storage (use DB in production)

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (users[email]) return res.status(400).send('User already exists');
  const hashed = await bcrypt.hash(password, 10);
  users[email] = { username, password: hashed };
  res.send('Signup successful!');
});

app.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const user = users[email];
  if (!user) return res.status(400).send('User not found');
  if (user.username !== username) return res.status(401).send('Incorrect username');

  const match = await bcrypt.compare(password, user.password);
  res.send(match ? 'Login successful!' : 'Incorrect password');
});
app.listen(3000, () => console.log('🟢 Backend running at http://localhost:3000'));
*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { sendResetEmail } = require('./mailer');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const users = {}; // { email: { username, password, token, expiry } }

app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  if (users[email]) return res.status(400).send('User exists');
  const hashed = await bcrypt.hash(password, 10);
  users[email] = { username, password: hashed };
  res.send('Signup successful');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user) return res.status(404).send('User not found');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).send('Wrong password');
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users[email];
  if (!user) return res.status(404).send('User not found');

  const token = crypto.randomBytes(20).toString('hex');
  users[email].resetToken = token;
  users[email].expiry = Date.now() + 3600000;

  const resetURL = `http://localhost:3000/forgot_password.html?token=${token}&email=${encodeURIComponent(email)}`;

  console.log("🔗 Reset Link:", resetURL); // ← just print it here
  res.send('Reset link generated. Check terminal for the URL.');
});


app.post('/reset-password', async (req, res) => {
  const { email, token, password } = req.body;
  const user = users[email];
  if (!user || user.resetToken !== token || Date.now() > user.expiry) {
    return res.status(400).send('Token invalid or expired');
  }
  const hashed = await bcrypt.hash(password, 10);
  users[email].password = hashed;
  delete users[email].resetToken;
  delete users[email].expiry;
  res.send('Password has been reset');
  console.log(`Reset request received for ${email}`);
});

app.listen(3000, () => console.log('🟢 Server running on http://localhost:3000'));
