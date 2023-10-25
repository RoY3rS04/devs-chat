import { Router } from "express";
import { createChatMessage, createGroupMessage, getChatMessages, getGroupMessages, getMessages } from "../controllers/messageController.js";
import validateJWT from "../middlewares/validateJWT.js";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";
import { chatExists, groupExists } from "../helpers/dbValidators.js";

const router = Router();

router.get('/', [
    validateJWT
] ,getMessages);

router.get('/chat/:id', [
    validateJWT,
    check('id', 'The id you provided is invalid').isMongoId(),
    validateFields
] ,getChatMessages);

router.get('/group/:id', [
    validateJWT,
    check('id', 'The id you provided is invalid').isMongoId(),
    validateFields
], getGroupMessages);

router.post('/chat/:id', [
    validateJWT,
    check('id', 'The id you provided is invalid').isMongoId(),
    check('id').custom(chatExists),
    check('content', 'The message field must be filled').not().isEmpty(),
    validateFields
], createChatMessage);

router.post('/group/:id', [
    validateJWT,
    check('id', 'The id you provided is invalid').isMongoId(),
    check('id').custom(groupExists),
    check('content', 'The message field must be filled').not().isEmpty(),
    validateFields
], createGroupMessage);

export default router;