import { Router } from "express";
import { createGroup, deleteGroup, getGroups, joinToGroup, leaveGroup, updateGroup } from "../controllers/groupController.js";
import validateJWT from "../middlewares/validateJWT.js";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import { groupExists } from "../helpers/dbValidators.js";

const router = Router();

router.get('/', [
    validateJWT
] ,getGroups);

router.post('/', [
    validateJWT,
    check('name', 'The name field is required').not().isEmpty(),
    validateFields
], createGroup);

router.delete('/:id', [
    validateJWT,
    check('id', 'Id is invalid').isMongoId(),
    check('id').custom(groupExists),
    validateFields
], deleteGroup);

router.put('/:id/users', [
    validateJWT,
    check('id', 'Group id is invalid').isMongoId(),
    check('id').custom(groupExists),
    validateFields
], joinToGroup);

router.delete('/:id/users', [
    validateJWT,
    check('id', 'Group id is invalid').isMongoId(),
    check('id').custom(groupExists),
    validateFields
], leaveGroup);

router.put('/:id', [
    validateJWT,
    check('id', 'Group id is invalid').isMongoId(),
    check('id').custom(groupExists),
    validateFields
], updateGroup)

export default router;