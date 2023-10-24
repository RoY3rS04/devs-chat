import Group from "../models/Group.js";

const getGroups = async (req, res) => {

    const { _id } = req.user;

    try {
        const groups = await Group.find({
            'users': _id
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

export {
    getGroups,
    createGroup,
    deleteGroup
}