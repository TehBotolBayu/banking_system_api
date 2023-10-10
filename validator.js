const express = require('express');
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.json());

// Define validation middleware using express-validator
const validateUser = [
    body('username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

app.post('/register', validateUser, (req, res) => {
  // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

  // If validation passes, process the registration
    const { username, email, password } = req.body;

  // Here, you can save the user to a database, perform further processing, etc.

  res.status(200).json({ message: 'Registration successful' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
