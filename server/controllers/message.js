const express = require('express');
const { validationResult, check, oneOf } = require('express-validator');

const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}
// Get All Messages of a Conversation
const getMessages = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;

    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) return res.status(404).json({ errors: 'Not Found' });
        const features = new APIfeatures(Message.find({ conversationId: id }), req.query)
        const messages = await features.query.sort('-createdAt')

        return res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

// Add a Message in conversation
const addMessage = async (req, res) => {
    const { text,media } = req.body;
    console.log(text,media)
    const { id } = req.params;

    try {
        const conversation = await Conversation.findById(id);
        if (!conversation) return res.status(404).json({ errors: 'Not Found' });

        const message = new Message({
            conversationId: id,
            sender: req.user.id,
            text: text,
            media:media
        });

        await message.save();
        return res.status(200).json(message);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};
const deleteMessage = async (req, res) => {
    try {
       await Message.findOneAndDelete({_id: req.params.id, sender: req.user.id})
        res.json({msg: 'Delete Success!'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};

module.exports = {
    getMessages,
    addMessage,
    deleteMessage,
};
