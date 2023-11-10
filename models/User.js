import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Message from "./Message.js";
import Chat from "./Chat.js";

const UserSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true
    },
    email: {
        required: true,
        type: String,
        unique: true,
        trim: true
    },
    password: {
        required: true,
        type: String
    },
    img: {
        type: String,
        default: 'https://ik.imagekit.io/4ztt7kzzm/default_user_image.png?updatedAt=1698091515542'
    },
    state: {
        type: Boolean,
        default: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    groups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group'
        }
    ],
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        }
    ]
})

UserSchema.pre('save', async function (next) {

    if (!this.isModified('password')) {
        next();
    }
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.post('save', async function (user) {

    if (user.state) {
        return;
    }

    await Promise.all([
        Message.updateMany({ user: user._id }, {state: false}),
        Chat.updateMany({
            $or: [
                {
                    'sender': user._id
                },
                {
                    'receiver': user._id
                }
            ]
        }, {state: false})
    ])
})

UserSchema.methods.toJSON = function () {
    const { __v, password, messages, ...user } = this.toObject();

    let hasPassword;

    if (password) {
        hasPassword = !bcrypt.compareSync(':P', password);
    }

    return {
        ...user, 
        hasPassword 
    };
}

const User = mongoose.model('User', UserSchema);

export default User;