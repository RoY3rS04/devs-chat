import { Router } from "express";
import { createChat, deleteChat, getChats } from "../controllers/chatController.js";
import validateJWT from '../middlewares/validateJWT.js';
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import { chatExists } from "../helpers/dbValidators.js";

const router = Router();

router.get('/', [
    validateJWT
], getChats);

router.post('/create', [
    validateJWT,
    check('receiver', 'The provided id is invalid').isMongoId(),
    validateFields
], createChat);

router.delete('/delete/:id', [
    validateJWT,
    check('id', 'The provided id is not valid').isMongoId(),
    check('id').custom(chatExists),
    validateFields
], deleteChat);

export default router;