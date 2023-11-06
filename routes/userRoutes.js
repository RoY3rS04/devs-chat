import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";
import { check } from "express-validator";
import { userExists } from "../helpers/dbValidators.js";
import validateFields from "../middlewares/validateFields.js";
import validateJWT from "../middlewares/validateJWT.js";

const router = Router();

router.get('/', getUsers);

router.get('/:id', [
    check('id', 'The id is invalid').isMongoId(),
    check('id').custom(userExists),
    validateFields
], getUser);

router.patch('/', [
    validateJWT,
] ,updateUser);

router.delete('/', [
    validateJWT,
    check('id', 'The id is invalid').isMongoId(),
    check('id').custom(userExists),
    validateFields
], deleteUser);

export default router;