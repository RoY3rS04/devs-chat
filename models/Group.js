import mongoose from "mongoose";

const GroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    state: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: 'https://ik.imagekit.io/4ztt7kzzm/default_group_image.png?updatedAt=1699391215031'
    }
})

const Group = mongoose.model('Group', GroupSchema);

export default Group;