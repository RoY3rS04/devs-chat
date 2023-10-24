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

const googleSuccess = async (req, res) => {

    const { name, email, picture: img } = req.user._json;

    try {
        
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                img,
                password: ':P'
            })

            await user.save();
        }

        if (!user.state) {
            return res.json({
                msg: 'Your account was deleted'
            })
        }

        res.json({
            ok: true,
            token: generateJWT(user.id),
            session: req.session
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            msg: 'Something went wrong'
        })
    }
}

const logOut = (req, res) => {
    req.session.destroy();

    res.json({
        ok: true,
        msg: 'Session destroyed correctly'
    })
}

export {
    registerUser,
    loginUser,
    googleSuccess,
    logOut
}