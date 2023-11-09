import User from "../models/User.js";
import jwt from 'jsonwebtoken';

const comprobateJWT = async (token = '') => {

    try {
        if (token.length < 10) {
            return null;
        }

        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(id);

        if (user && user.state) {
            return user;
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }
}

export default comprobateJWT