import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import googlePass from 'passport-google-oauth20';
import authRoutes from './routes/authRoutes.js';
import connectDB from './database/config.js';
import session from 'express-session';

dotenv.config();

const app = express();

app.use(express.json());

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {secure: false}
}));

connectDB();

const googleStrategy = googlePass.Strategy;

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:8080/auth/google/success"
    },
    function(accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
     done(null, user);
})

app.use('/auth', authRoutes);

app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})