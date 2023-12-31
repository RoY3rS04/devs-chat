import Chat from '../models/Chat.js';
import User from '../models/User.js'

const getChats = async (req, res) => {

    const { _id } = req.user;

    try {
        const chats = await Chat.find({
            $or: [
                {
                    'sender': _id
                },
                {
                    'receiver': _id
                }
            ],
            state: true
        }).populate('sender', 'img name')
            .populate('receiver', 'img name')
            .populate({
                path: 'messages'
            });

        if (!chats) {
            return res.json({
                ok: false,
                msg: 'The user doesn\'t have any chat yet'
            })
        }

        return res.json({
            ok: true,
            chats
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            error
        })
    }

}

const createChat = async (req, res) => {

    const { receiver } = req.body;
    const { _id } = req.user;

    if (!receiver) {
        return res.json({
            ok: false,
            msg: 'Missing receiver user'
        })
    }

    try {
        
        const [user1, user2] = await Promise.all([
            User.findById(receiver),
            User.findById(_id)
        ]); 

        if (!user1) {
            return res.json({
                ok: false,
                msg: 'The user1 doesn\'t exists'
            })
        }

        if (!user1.state) {
            return res.json({
                ok: false,
                msg: 'The user1 was deleted from the app'
            })
        }

        const chat = await Chat.findOne({
            $or: [
                {
                    'sender': _id
                },
                {
                    'receiver': _id
                }
            ],
            $and: [
                {
                    $or: [
                        {
                            'sender': receiver
                        },
                        {
                            'receiver': receiver
                        }
                    ]
                }
            ],
            state: true
        })

        if (chat) {
            return res.status(400).json({
                ok: false,
                msg: 'You already have a chat with that person'
            })
        }

        const new_Chat = await Chat.create({ sender: _id, receiver: user1.id });
        user1.chats.push(new_Chat._id);
        user2.chats.push(new_Chat._id);

        await Promise.all([
            user1.save(),
            user2.save()
        ]);

        res.json({
            ok: true,
            new_Chat
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }
}

const deleteChat = async (req, res) => {

    const { id } = req.params;

    try {
        const chat = await Chat.findByIdAndUpdate(id, {state: false}, {new: true});

        res.json({
            ok: true,
            chat
        })

    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

export {
    createChat,
    deleteChat,
    getChats
}