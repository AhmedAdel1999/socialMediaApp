const { validationResult } = require('express-validator');

const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

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

// Get All Users Conversations
 const getAllUserConv = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }
        const features = new APIfeatures(Conversation.find({
            members: {
                $all: [req.user.id],
            },
        }), req.query)
        const conversations = await features.query.sort('-updatedAt')
        .populate('members')

        return res.status(200).json(conversations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: 'Server Error' });
    }
};

// Get Conversation Id of Two or Group of Users
 const getUserConvBetweenTwo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        const conversation = await Conversation.findOne({
            members: {
                $all: [req.params.id, req.user.id],
            },
        }).populate('members');

        if (!conversation) {
            return res.status(404).json({
                error: 'Conversation not found',
            });
        }

        return res.status(200).json(conversation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: 'Server Error' });
    }
};

// Start Conversation between Users
 const createConv = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        let conversation = await Conversation.findOne({
            members: {
                $all: [req.params.id, req.user.id],
            },
        });

        console.log(conversation);

        if (conversation) {
            return res.status(409).json({
                error: 'Conversation already exists',
            });
        }

        conversation = new Conversation({
            members: [req.params.id, req.user.id],
        });

        console.log(conversation);

        conversation = await conversation.save();
        return res.status(200).json(conversation);
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: 'Server Error' });
    }
};
const deleteConversation= async (req, res) => {
    try {
        const newConver = await Conversation.findOneAndDelete({
            members: {
                $all: [req.params.id, req.user.id],
            },
        })
        console.log(req.params.id, req.user.id)
        await Message.deleteMany({conversationId: newConver._id},{new:true})
        
        res.json({msg: 'Delete Success!'})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
};
module.exports = {
    createConv,
    getAllUserConv,
    getUserConvBetweenTwo,
    deleteConversation,
};
