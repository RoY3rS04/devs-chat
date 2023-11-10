import { Socket } from 'socket.io';
import comprobateJWT from '../helpers/comprobateJWT.js';
import { createChatMessage, createGroupMessage } from './messageSockets.js';

export default async function socketController(socket = new Socket(), io) {

    const token = socket.handshake.headers['x-token'];

    const user = await comprobateJWT(token);

    if (!user) {
        return socket.disconnect();
    }

    user.chats.forEach(chat => {
        socket.join(`chats/${String(chat)}`);
    })

    user.groups.forEach(group => {
        socket.join(`groups/${String(group)}`);
    })

    socket.on('/messages/group', (payload) => createGroupMessage(socket, payload, io));
    socket.on('/messages/chat', (payload) => createChatMessage(socket, payload, io));
}