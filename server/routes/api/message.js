const express = require('express');
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const { addMessage, getMessages , deleteMessage } = require('../../controllers/message');

const router = express.Router();

router.get('/:id', getMessages);
router.delete('/:id',auth, deleteMessage);

router.post(
    '/:id',
    [auth, check('text', 'Please Include a Message').not().isEmpty()],
    addMessage
);

module.exports = router;
