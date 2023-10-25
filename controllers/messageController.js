import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Group from '../models/Group.js'

const getMessages = async (req, res) => {

    try {
        const messages = await Message.find().populate('user', 'name');

        res.json({
            ok: true,
            messages
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const getChatMessages = async (req, res) => {

    const { id } = req.params;

    try {
        const chat = await Chat.findById(id)
            .populate({
                path: 'messages',
                populate: {
                    path: 'user'
                }
            });

        if (!chat) {
            return res.json({
                ok: false,
                msg: 'The chat doesn\'t exists'
            })
        }

        res.json({
            ok: true,
            messages: chat.messages
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const getGroupMessages = async (req, res) => {

    const { id } = req.params;

    try {
        const group = await Group.findById(id)
            .populate({
                path: 'messages',
                populate: {
                    path: 'user'
                }
            });

        if (!group) {
            return res.json({
                ok: false,
                msg: 'The group doesn\'t exists'
            })
        }

        res.json({
            ok: true,
            messages: group.messages
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }
}

const createChatMessage = async (req, res) => {

    const { _id } = req.user;
    const { id: chatId } = req.params;
    const { content } = req.body;

    try {
        const chat = await Chat.findById(chatId);

        if (String(chat.sender) !== String(_id) && String(chat.receiver) !== String(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of this chat'
            })
        }

        const message = await Message.create({ user: _id, content });
        
        chat.messages.push(message);

        await chat.save();

        res.json({
            ok: true,
            message
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const createGroupMessage = async (req, res) => {

    const { _id } = req.user;
    const { id: groupId } = req.params;
    const { content } = req.body;

    try {
        const group = await Group.findById(groupId);

        if (!group.users.includes(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of this group'
            })
        }

        const message = await Message.create({ user: _id, content });
        
        group.messages.push(message);

        await group.save();

        res.json({
            ok: true,
            message
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

export {
    getMessages,
    getChatMessages,
    getGroupMessages,
    createChatMessage,
    createGroupMessage
}