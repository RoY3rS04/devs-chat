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

export {
    getMessages,
    getChatMessages,
    getGroupMessages
}