const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middleware/auth');
const { registerUser,updateUser } = require('../../controllers/users');

const router = express.Router();

// @router  Post api/users (Register User Route)
// @desc    Register User
// @access  Public
// @return  jwt token
router.post(
    '/',
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid Email').isEmail(),
        check(
            'password',
            'Please enter a password of length more than 6'
        ).isLength({ min: 6 }),
    ],
    registerUser
);
router.put(
    '/update/:id',
    auth,
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid Email').isEmail(),
        check(
            'password',
            'Please enter a password of length more than 6'
        ).isLength({ min: 6 }),
    ],
    updateUser
);

module.exports = router;
