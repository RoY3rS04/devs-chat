import fs from 'node:fs/promises';
import User from "../models/User.js";
import imageKit from "../helpers/imageKit.js";
import bcrypt from 'bcrypt';

const getUsers = async (req, res) => {

    const { from = 0, limit = 10 } = req.query;

    try {
        const [users, total] = await Promise.all(
            [
                User.find({
                    state: true
                }).skip(Number(from))
                .limit(Number(limit)),
                User.countDocuments({ state: true })
            ]
        );

        res.json({
            ok: true,
            total,
            users
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }
}

const getUser = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findById(id);

        res.json({
            ok: true,
            user
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }
}

const updateUser = async (req, res) => {

    const { name, password, new_password } = req.body;
    const { _id } = req.user;

    let image;
    let tempFilePath;

    if (req.files) {
        tempFilePath = req.files.image.tempFilePath;
    }

    if (!name && !tempFilePath && !new_password) {
        return res.status(400).json({
            ok: false,
            msg: 'Nothing to update'
        })
    }

    if (password && !await bcrypt.compare(password, req.user.password)) {
        return res.status(400).json({
            ok: false,
            msg: 'Incorrect last-password couldn\'t update password'
        })
    }

    if (tempFilePath) {
        const file = await fs.readFile(tempFilePath);

        const { url, fileId } = await imageKit().upload({
            file,
            fileName: 'user_image'
        });

        image = `${url}*${fileId}`;
    }

    try {

        const user = await User.findById(_id);

        if (user.img.split('*').length > 1 && image) {
            const [, id] = user.img.split('*');

            await imageKit().deleteFile(id);

            user.img = image;
        
        } else if (user.img.split('*').length <= 1 && image) {
            user.img = image;
        }

        user.name = name.trim() || user.name;
        user.password = new_password.trim() || user.password;

        await user.save();

        return res.json({
            ok: true,
            user,
        });
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const deleteUser = async (req, res) => {

    const { _id } = req.user;

    try {
        const user = await User.findByIdAndUpdate(_id, { state: false }, {new: true});

        res.json({
            ok: true,
            user
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

export {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
}