import imageKit from "../helpers/imageKit.js";
import Group from "../models/Group.js";
import User from "../models/User.js";
import fs from 'node:fs/promises';

const getGroups = async (req, res) => {

    const { _id } = req.user;

    try {
        const groups = await Group.find({
            'users': _id,
            state: true
        }).distinct('_id');

        res.json({
            groups
        })

    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const createGroup = async (req, res) => {

    const { _id } = req.user;
    const { name } = req.body;

    try {
        const group = await Group.create({ name, users: [_id] });

        res.json({
            ok: true,
            group
        })
    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const deleteGroup = async (req, res) => {

    const { id } = req.params;

    try {
        const group = await Group.findById(id);

        if (!group) {
            return res.json({
                ok: false,
                msg: 'The group you are trying to delete doesn\'t exists'
            })
        }

        group.state = false;

        await group.save();

        res.json({
            ok: true,
            group
        })

    } catch (error) {
        res.json({
            ok: false,
            error
        })
    }

}

const joinToGroup = async (req, res) => {
    
    const { _id } = req.user;
    const { id : groupId } = req.params;

    try {

        const group = await Group.findById(groupId);

        if (group.users.includes(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are already on that group'
            })
        }

        group.users.push(_id);

        await group.save();

        res.json({
            ok: true,
            group
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

const leaveGroup = async (req, res) => {

    const { _id } = req.user;
    const { id : groupId } = req.params;

    try {

        const group = await Group.findById(groupId);

        if (!group.users.includes(_id)) {
            return res.status(400).json({
                ok: false,
                msg: 'You are not a member of the group can\'t do this action'
            })
        }

        group.users = group.users.filter(user => String(user) !== String(_id));

        await group.save();

        res.json({
            ok: true,
            group
        })

    } catch (error) {
        res.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

const updateGroup = async (req, res) => {

    const { name } = req.body;
    const { id } = req.params;

    let tempFilePath;

    if (req.files) {
        tempFilePath = req.files.image.tempFilePath;
    }

    let imageUrl;

    if (!name && !tempFilePath) {
        return res.status(400).json({
            ok: false,
            msg: 'Nothing to update'
        })
    }

    if (tempFilePath) {
        const file = await fs.readFile(tempFilePath);

        const { url, fileId } = await imageKit().upload({
            file,
            fileName: 'group_image'
        })

        imageUrl = `${url}*${fileId}`;
    }

    try {
        const group = await Group.findByIdAndUpdate(id, { name, img: imageUrl });
        
        if (group.img && imageUrl) {
            const [, id] = group.img.split('*');

            await imageKit().deleteFile(id);
        }

        res.json({
            ok: true,
            group
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}

export {
    getGroups,
    createGroup,
    deleteGroup,
    joinToGroup,
    leaveGroup,
    updateGroup
}