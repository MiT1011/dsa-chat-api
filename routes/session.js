import express from 'express';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

const router = express.Router();

/* 
Add new session
Requires userId in req.body
POST Endpoint: http://localhost:3000/sessions/
*/
router.post('/', async (req, res) => {
    console.log(req.body);
    const session = new Session({
        userId: req.body.userId,
        topicName: req.body.topicName
    });
    await session.save();
    const user = await User.findById(session.userId);
    user.sessions.push(session._id);
    await user.save();
    console.log('Session created:', session);
    res.status(201).json(session);
});

/* 
Fetch all the sessions of a user
Requires userId in req.body
GET Endpoint: http://localhost:3000/sessions/
*/
router.get('/', async (req, res) => {
    const sessions = await Session.find({ userId: req.body.userId });
    res.json(sessions);
});

/*
Update session name
Requires sessionId in req.body
PUT Endpoint: http://localhost:3000/sessions/session-name/
*/

router.put('/session-name', async (req, res) => {
    const sessionId = req.body.sessionId;
    const session = await Session.findById(sessionId);
    session.sessionName = req.body.sessionName;
    await session.save();
    console.log("Session name updated Successfully");
    res.status(200).json(session);
});

/* 
Delete session & chats associated to session
Requires sessionId in params
DELETE Endpoint: http://localhost:3000/sessions/delete-session/:session_id
*/

router.delete('/delete-session/:sessionId', async (req, res) => {
    try {
        const sessionId = req.params.sessionId;
        const result_chat = await Chat.deleteMany({ sessionId: sessionId });
        if (result_chat) {
            const result_session = await Session.deleteOne({ _id: sessionId });
            if (result_session) {
                res.status(200).json({ "message": "Success" })
            } else {
                res.status(500).json({ "message": "error in deleting session" })
            }
        } else {
            res.status(500).json({ "message": "error in deleting chats" })
        }
    } catch (err) {
        console.log(err);
    }
})

export { router as sessionRoutes };
