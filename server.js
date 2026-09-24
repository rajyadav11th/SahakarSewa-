require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const connectDB = require('./config/db');

const app = express();

// Database connect karo
connectDB();

// View engine set karo (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const workerRoutes = require('./routes/workerRoutes');
app.use('/', workerRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/', bookingRoutes);

const paymentRoutes = require('./routes/paymentRoutes');
app.use('/', paymentRoutes);

const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/', subscriptionRoutes);

const kycRoutes = require('./routes/kycRoutes');
app.use('/', kycRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.render('home')
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai http://localhost:${PORT} par`);
});