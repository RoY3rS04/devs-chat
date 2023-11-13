import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Group from '../models/Group.js'
import User from "../models/User.js";

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
    const { _id } = req.user;

    try {
        const chat = await Chat.findById(id)
            .populate({
                path: 'messages',
                match: {
                    state: true
                },
                populate: {
                    path: 'user'
                }
            }).populate('receiver', '_id name img').populate('sender', '_id name img');

        if (!chat) {
            return res.json({
                ok: false,
                msg: 'The chat doesn\'t exists'
            })
        }

        res.json({
            ok: true,
            chat: {
                _id: chat._id,
                messages: chat.messages,
                user: [
                    chat.sender, chat.receiver
                ].find(user => String(user._id) !== String(_id))
            }
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
                match: {
                    state: true
                },
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
            group
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
            message: await message.populate('user')
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

        if (group.name !== 'general' && !group.users.includes(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of this group'
            })
        }

        const message = await Message.create({ user: _id, content });
        
        group.messages.push(message);

        await group.save();

        const newMessage = await message.populate('user');

        res.json({
            ok: true,
            message: newMessage
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

const deleteMessage = async (req, res) => {

    const { _id } = req.user;
    const { id: messageId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (String(message.user) !== String(_id)) {
            return res.json({
                ok: false,
                msg: 'You cannot remove other users messages'
            })
        }

        message.state = false;

        await message.save();

        res.json({
            ok: true,
            message
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

const updateMessage = async (req, res) => {

    const { _id } = req.user;
    const { id: messageId } = req.params;
    const { content } = req.body;

    try {
        const message = await Message.findById(messageId);

        if (String(message.user) !== String(_id)) {
            return res.json({
                ok: false,
                msg: 'You cannot edit other users messages'
            })
        }

        message.content = content;

        await message.save();

        res.json({
            ok: true,
            message
        })
    } catch (error) {
        res.json({
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
    createGroupMessage,
    deleteMessage,
    updateMessage
}