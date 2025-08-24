// server/server.js
import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dirname } from 'path';

// Configure dotenv with the correct path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Debugging code
console.log('--- Checking Environment Variables ---');
console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);
console.log('SENDER_PASSWORD:', process.env.SENDER_PASSWORD ? 'Loaded successfully' : 'NOT LOADED or UNDEFINED');
console.log('------------------------------------');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

const usersFilePath = path.join(__dirname, 'users.json');
const otpStore = {}; // In-memory store for OTPs { email: { otp, expiry } }

// --- Utility Functions ---

// Read users from the JSON file
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

// Write users to the JSON file
const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing to users file:", error);
  }
};

// --- Nodemailer Setup ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

// --- New Welcome Email Function ---
const sendWelcomeEmail = (email) => {
    // Extract username from email (everything before @)
    const username = email.split('@')[0];
    
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'A warm welcome to MaXFinder.',
        html: `
            <div style="font-family: 'JetBrains Mono', monospace; background-color: #2e2e2e; color: #ffffff; padding: 20px; border-radius: 8px;">
                <h1 style="color: #00FFFF; font-family: 'JetBrains Mono', monospace;">Welcome to MaXFinder!</h1>
                <h3 style="color: #ffffff; font-family: 'JetBrains Mono', monospace;">Hi ${username},</h3>
                <p style="color: #ffffff; font-family: 'JetBrains Mono', monospace;">My name is Jakir Hussain, and I'm the Founder of MaXFinder.</p>
                <p style="color: #ffffff; font-family: 'JetBrains Mono', monospace;">It's great and fantastic to have you on board!</p>
                <br>
                <p style="color: #ffffff; font-family: 'JetBrains Mono', monospace;">Best regards,</p>
                <h3 style="color: #ffffff; font-family: 'JetBrains Mono', monospace;"><strong>Sheikh Jakir Hussain</strong></h3>
            </div>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error sending welcome email to ${email}:`, error);
        } else {
            console.log(`Welcome email sent successfully to ${email}: ${info.response}`);
        }
    });
};



// --- API Endpoints ---

// 1. SEND OTP FOR REGISTRATION
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const users = readUsers();
  if (users.find(user => user.email === email)) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

  otpStore[email] = { otp, expiry };
  console.log(`Generated OTP for ${email}: ${otp}`);

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Your MaXFinder Verification Code',
    text: `Your one-time password (OTP) is: ${otp}\nIt is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }
    res.status(200).json({ message: 'OTP has been sent to your email.' });
  });
});

// 2. REGISTER USER
app.post('/api/register', async (req, res) => {
  const { email, password, otp } = req.body;
  const storedOtpData = otpStore[email];

  if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expiry) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = readUsers();
    users.push({ email, password: hashedPassword });
    writeUsers(users);

    delete otpStore[email]; // Clean up OTP after use

    // Send the welcome email
    sendWelcomeEmail(email);

    res.status(201).json({ message: 'Registration successful! You can now sign in.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.' });
  }
});


// 3. LOGIN USER
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'User not found. Please check your email or sign up.' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            res.status(200).json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});