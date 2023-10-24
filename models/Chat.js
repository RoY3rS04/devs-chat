import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    state: {
        type: Boolean,
        default: true
    }
})

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;