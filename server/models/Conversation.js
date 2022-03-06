const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    ],
},
{
    timestamps: true
});

const Conversation = mongoose.model('conversation', ConversationSchema);

module.exports = Conversation;
