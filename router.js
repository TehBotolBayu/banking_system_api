const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const userController = require('./controller/userController');
const accountController = require('./controller/accountController');
const transactionController = require('./controller/transactionController');
const checkToken = require('./middleware/checkToken')


const validateUser = [
    body('name').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
];

const validateAccount = [
    body('balance').isInt({ min: 100000 }).withMessage('Number must be above 100,000')
];

function validate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}


// User and Profile

router.post('/users', validateUser, validate, userController.registerUser);

router.get('/users', userController.getUser);

router.get('/users/:userId', userController.getUserById);

router.put('/users/changepassword/:userId', userController.updateUserPw);

router.put('/users/:userId', userController.updateUser);

router.delete('/users/:userId', userController.deleteUser);

router.post('/auth/login', userController.loginUser)

router.get('/auth/authenticate', checkToken, userController.getProfile);


// Account

router.post('/accounts', validateAccount, validate, accountController.createAccount);

router.get('/accounts', accountController.getAccounts);

router.get('/accounts/:accountId', accountController.getAccountById);

router.put('/accounts/:accountId', accountController.updateAccount);

router.delete('/accounts/:accountId', accountController.deleteAccount);

// Transaction

router.post('/transactions', transactionController.createTransaction);

router.get('/transactions', transactionController.getTransactions);

router.get('/transactions/:transaction', transactionController.getTransactionById);


module.exports = router