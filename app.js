import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import { authRoutes } from './routes/auth.js';
import { sessionRoutes } from './routes/session.js';
import { chatRoutes } from './routes/chats.js';

import './config/passport.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


// mongoose.connect('mongodb://localhost:27017/chatbot', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // Remove deprecated options
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/chats', chatRoutes);

export default app;
