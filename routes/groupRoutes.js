import { Router } from "express";
import { createGroup, deleteGroup, getGroups } from "../controllers/groupController.js";
import validateJWT from "../middlewares/validateJWT.js";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";

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
    validateFields
], deleteGroup)

export default router;