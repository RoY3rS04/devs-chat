import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import { Socket } from "socket.io";

const createChatMessage = async (socket = new Socket(), payload, io) => {

    const { _id } = payload.user;
    const { id: chatId } = payload;
    const { content } = payload.body;

    try {
        const [chat, user] = await Promise.all([
            Chat.findById(chatId),
            User.findById(_id)
        ]);

        if (String(chat.sender) !== String(_id) && String(chat.receiver) !== String(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of this chat'
            })
        }

        const message = await Message.create({ user: _id, content });
        
        chat.messages.push(message);
        user.messages.push(message);

        await Promise.all([
            chat.save(),
            user.save()
        ])

        const newMessage = await message.populate('user')

        io.to(`chats/${chatId}`).emit('new-message', {
            ok: true,
            message: newMessage,
            belongsTo: chatId
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}

const createGroupMessage = async (socket = new Socket(), payload, io) => {

    const { _id } = payload.user;
    const { id: groupId } = payload;
    const { content } = payload.body;

    try {
        const [group, user] = await Promise.all([
            Group.findById(groupId),
            User.findById(_id)
        ]);

        if (group.name !== 'general' && !group.users.includes(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of this group'
            })
        }

        const message = await Message.create({ user: _id, content });
        
        group.messages.push(message);
        user.messages.push(message);

        await Promise.all([
            group.save(),
            user.save()
        ])

        const newMessage = await message.populate('user');

        io.to(`groups/${groupId}`).emit('new-message', {
            ok: true,
            message: newMessage,
            belongsTo: groupId
        });

    } catch (error) {
        socket.emit('new-message', {
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
    createChatMessage,
    createGroupMessage,
    updateMessage
}