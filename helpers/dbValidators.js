import Group from "../models/Group.js";
import Chat from '../models/Chat.js';
import User from "../models/User.js";
import Message from '../models/Message.js'

const groupExists = async (id = '') => {

    const group = await Group.findById(id);

    if (!group) {
        throw Error('The group doesn\'t exists');
    }

    if (!group.state) {
        throw Error('The group was deleted');
    }
}

const chatExists = async (id = '') => {
    const chat = await Chat.findById(id);

    if (!chat) {
        throw Error('The chat doesn\'t exists');
    }

    if (!chat.state) {
        throw Error('The chat was deleted');
    }
}

const userExists = async (id = '') => {
    const user = await User.findById(id);

    if (!user) {
        throw Error('The user doesn\'t exists');
    }

    if (!user.state) {
        throw Error('The user was deleted');
    }
}

const messageExists = async (id = '') => {

    const message = await Message.findById(id);

    if (!message) {
        throw Error('The message doesn\'t exists');
    }

    if (!message.state) {
        throw Error('The message was deleted');
    }
}

export {
    groupExists,
    chatExists,
    userExists,
    messageExists
}