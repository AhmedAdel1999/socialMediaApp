const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    profileImg: {
        type: String,
        default:"//www.gravatar.com/avatar/005282aa6747a2c82d09065d1194dd20?s=200&r=pg&d=mm"
    },
    followers: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
            },
        },
    ],
    following: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users',
            },
        },
    ],
    DOB: {
        type: Date,
    },
});

const Profile = mongoose.model('profile', ProfileSchema);

module.exports = Profile;
