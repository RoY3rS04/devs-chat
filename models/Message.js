import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now()
    },
    state: {
        type: Boolean,
        default: true
    }
})

const Message = mongoose.model('Message', MessageSchema);

export default Message;