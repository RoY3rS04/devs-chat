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

    const { name, password } = req.body;
    const { tempFilePath } = req.files.image;
    const { id } = req.params;

    let image;

    if (tempFilePath) {
        const file = await fs.readFile(tempFilePath);

        const { url, fileId } = await imageKit().upload({
            file,
            fileName: 'user_image'
        });

        image = `${url}*${fileId}`;
    }

    try {

        const user = await User.findById(id);
        const salt = await bcrypt.genSalt(10);

        if (user.img.split('*').length > 1 && image) {
            const [, id] = user.img.split('*');

            await imageKit().deleteFile(id);

            user.img = image;
        
        } else if (user.img.split('*').length <= 1 && image) {
            user.img = image;
        }

        user.name = name ?? user.name;
        user.password = password ? await bcrypt.hash(password, salt) : user.password;

        await user.save();

        return res.json({
            ok: true,
            user
        });
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const deleteUser = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { state: false }, {new: true});

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
    deleteUser
}