require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('admin123', 10); // Password badal lena

  await Admin.create({
    email: 'admin@coopseva.com', // Apna email daal do
    password: hashedPassword
  });

  console.log('Admin created!');
  process.exit();
}

createAdmin();