const express = require('express');
const { check } = require('express-validator');
const auth = require('../../middleware/auth');

const {
    createConv,
    getUserConvBetweenTwo,
    getAllUserConv,
    deleteConversation,
} = require('../../controllers/conversation');

const router = express.Router();

// Get User Conversations
router.get('/', auth, getAllUserConv);

// Get a Single Conversations
router.get('/:id', auth, getUserConvBetweenTwo);

// Create Conversations
router.post('/:id', auth, createConv);

// Delete Conversations
router.delete('/:id', auth, deleteConversation);

module.exports = router;
