const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const userController = require('./controller/userController');
const accountController = require('./controller/accountController');
const transactionController = require('./controller/transactionController');

const validateUser = [
    body('name').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];
/*
const validateAccount = [
    body('name').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const validateTransaction = [
    body('amount').isNumeric({min: 10000})
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];
*/
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
};

router.post('/users', validateUser, validate, userController.registerUser);

router.get('/users', userController.getUser);

router.get('/users/:userId', userController.getUserById);

router.put('/users/:userId', )

router.post('/accounts', accountController.createAccount);

router.get('/accounts', accountController.getAccounts);

router.get('/accounts/:accountId', accountController.getAccountById);

router.post('/transactions', transactionController.createTransaction);

router.get('/transactions', transactionController.getTransactions);

router.get('/transactions/:transaction', transactionController.getTransactionById);


module.exports = router