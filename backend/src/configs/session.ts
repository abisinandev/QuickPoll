import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from '../utils/env-config';

export const sessionMiddleware = session({
    secret: env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,
    proxy: env.NODE_ENV === 'production',

    store: MongoStore.create({
        mongoUrl: env.MONGO_URL,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60,
    }),

    cookie: {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    },
});