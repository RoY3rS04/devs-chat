import { Router } from "express";
import { getChatMessages, getGroupMessages, getMessages } from "../controllers/messageController.js";
import validateJWT from "../middlewares/validateJWT.js";
import { check } from "express-validator";
import validateFields from "../middlewares/validateFields.js";

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

export default router;