const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'conversation',
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    text:String ,
    media: Array,
},
{
    timestamps: true
}
);

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;
