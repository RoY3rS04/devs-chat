import { Router } from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/userController.js";

const router = Router();

router.get('/', getUsers);

router.get('/:id', getUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;