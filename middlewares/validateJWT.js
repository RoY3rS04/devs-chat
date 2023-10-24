import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const validateJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            ok: false,
            msg: 'No token provided'
        })
    }

    try {

        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(id);

        if (!user) {
            return res.json({
                ok: false,
                msg: 'The user doesn\'t exists'
            })
        }

        if (!user.state) {
            return res.json({
                ok: false,
                msg: 'The user was deleted'
            })
        }

        req.user = user;

        next();
    } catch (error) {
        return res.json({
            ok: false,
            msg: 'Invalid Token'
        })
    }

}

export default validateJWT;