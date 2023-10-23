import generateJWT from "../helpers/generateJWT.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt';

const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        
        return res.json({
            msg: 'name, email and password fields are required'
        })

    }

    const user = await User.findOne({ email });

    if (user) {
        return res.json({
            msg: 'That email is already registered'
        })
    }

    try {
        
        const user = await User.create({
            name,
            email,
            password
        })

        res.json({
            user,
            token: generateJWT(user.id)
        })
    } catch (error) {
        res.json({
            error
        })
    }

}

const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            msg: 'Please fill all the fields'
        })
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({
            msg: 'There is no user with that email'
        })
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.json({
            msg: 'The password you provided is not correct'
        })
    }

    res.json({
        user,
        token: generateJWT(user.id)
    });
}

const googleSuccess = (req, res) => {
    res.json({
        user: req.user._json
    })
}

export {
    registerUser,
    loginUser,
    googleSuccess
}