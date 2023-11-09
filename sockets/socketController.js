import { Socket } from 'socket.io';
import comprobateJWT from '../helpers/comprobateJWT.js';

export default async function socketController(socket = new Socket(), io) {

    const token = socket.handshake.headers['x-token'];

    const user = await comprobateJWT(token);

    /* if (!user) {
        socket.disconnect();
    } */

    socket.on('connect', () => {
        console.log('connected finally')
    })

    socket.on('hello', (data) => {
        console.log(data);
    })

}