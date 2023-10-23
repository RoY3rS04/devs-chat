import { Router } from "express";
import passport from 'passport';
import { googleSuccess, loginUser, registerUser } from "../controllers/authController.js";

const router = Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/success',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    googleSuccess
)

export default router;