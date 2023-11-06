import { Router } from "express";
import passport from 'passport';
import { getAuth, googleSuccess, logOut, loginUser, registerUser, verifySession } from "../controllers/authController.js";
import validateJWT from "../middlewares/validateJWT.js";

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

router.post('/logout', logOut);

router.get('/session', verifySession);

router.get('/', [
    validateJWT
], getAuth)

export default router;