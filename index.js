import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import googlePass from 'passport-google-oauth20';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectDB from './database/config.js';
import session from 'express-session';
import fileUpload from 'express-fileupload';
import messageRoutes from './routes/messageRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import cors from 'cors';
import socketController from './sockets/socketController.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(express.json());

const permitedDomains = [
    process.env.FRONTEND_URL,
    'http://localhost:8080'
];

const corsOptions = {
    origin: function (origin, cb) {
        if (permitedDomains.indexOf(origin) !== -1 || !origin) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

io.on('connection', (socket) => socketController(socket, io));

httpServer.listen(3000);

app.set('io', io);

app.use(cors(corsOptions));

app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    cookie: {secure: false}
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))

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

/* app.get('/', (req, res) => {

    if (!req.passport?.user || !req.token) {
        const error = new Error('No session or token');

        return res.json({
            msg: error.message
        });
    }
}) */

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/messages', messageRoutes);

app.use('/chats', chatRoutes);

app.use('/groups', groupRoutes);

app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})