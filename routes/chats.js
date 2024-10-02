import express from 'express';
import Chat from '../models/Chat.js';
import Session from '../models/Session.js';
import User from '../models/User.js';

const router = express.Router();

/* 
Adds a chat to particular session
Requires message and sender (user, bot) in body & sessionId in params
POST Endpoint: http://localhost:3000/chats/:sessionId
*/
router.post('/:sessionId', async (req, res) => {
    const chat = new Chat({
        sessionId: req.params.sessionId,
        message: req.body.message,
        sender: req.body.sender
    });
    await chat.save();

    const session = await Session.findById(chat.sessionId);
    session.chats.push(chat._id);
    await session.save();
    console.log('Chat added:', chat);
    res.status(201).json(chat);
});

// {
    //     "userid" : "",
    //     "session_id": "",
    //     "topic_name": "",
    //     "user_que": "",
    //     "ai_ans": ""
    // }

/*
Accept the body from AI code & add chat to particular session
Requires userId, sessionId, topicName, userQue, aiAns
POST Endpoint: http://localhost:3000/chats/session/:sessionId
*/

router.post('/session/:sessionId', async (req, res) => {
    try {
        const userId = await User.findById(req.body.userId);
        if (!userId) {
            return res.status(404).send({"message": "User not found"});
        }
        console.log(req.body);
        
        const sessionId = req.params.sessionId;
        const session = await Session.findOne({userId: userId, _id: sessionId});
        const userMessage = req.body.userPrompt;
        const aiMessage = req.body.aiResponse;

        if (session) {
            const chat_human = new Chat({
                sessionId: sessionId,
                message: userMessage,
                sender: "human"
            });
            await chat_human.save();
            session.chats.push(chat_human._id);

            const chat_ai = new Chat({
                sessionId: sessionId,
                message: aiMessage,
                sender: "ai"
            });
            await chat_ai.save();
            session.chats.push(chat_ai._id);

            await session.save(); // Save the session with the updated chats array

            console.log("Chat added to db");
            res.status(201).send({"message": "Chat added to DB"});
        } else {
            res.status(404).send({"message": "Session not found"});
        }
    } catch (error) {
        console.error("Error adding chat to db:", error);
        res.status(500).send({"message": "Error adding chat to DB"});
    }
});

/* 
Fetch all the chats of a session
Requires SessionId in params
GET Endpoint: http://localhost:3000/chats/session/:sessionId
*/

router.get('/session/:sessionId', async (req, res) => {
    const chats = await Chat.find({ sessionId: req.params.sessionId });
    res.json(chats);
});

/* 
Fetch all chat as well as session data
Requires userId in params
GET Endpoint: http://localhost:3000/chats/user/:userId
*/
router.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        let data = [];

        for (const element of user.sessions) {
            let json_data = {
                sessionId: element,
                topicName: "",
                sessionName: "",
                chats: []
            };

            const session = await Session.findById(element);
            json_data['topicName'] = session.topicName;
            json_data['sessionName'] = session.sessionName;

            const chats = await Chat.find({ sessionId: element }).sort('timestamp');
            let chat_data = {};

            chats.forEach(chat => {
                if (chat.sender === 'human') {
                    chat_data['human'] = chat.message;
                } else if (chat.sender === 'ai') {
                    chat_data['ai'] = chat.message;
                    json_data.chats.push(chat_data);
                    chat_data = {}; // Reset chat_data for the next pair
                }
            });

            data.push(json_data);
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

export { router as chatRoutes };

// [
// {
//     "sesionId": "s1",
//     "chats": [
//         {
//             "human": "hi",
//             "ai": "hello"
//         },
//         {
//             "human": "hi",
//             "ai": "hello"
//         }
//     ]
// },
//     {
//         "sesionId": "s2",
//         "chats": [
//             {
//                 "human": "hi",
//                 "ai": "hello"
//             },
//             {
//                 "human": "hi",
//                 "ai": "hello"
//             }
//         ]
//     }
// ]


// router.get('/user/:userId', async (req, res) => {
//     const user = await User.findById(req.params.userId);
//     let json_data = {
//         sesionId: "",
//         topicName: "",
//         chats: []
//     }
//     let chat_data = {
//         human: "",
//         ai: ""
//     }
//     let data = []
    
//     user.sessions.forEach(async element => {    
//         json_data['sesionId'] = element;
//         const session = await Session.findById(element);
//         // console.log(session);
        
//         json_data['topicName'] = session.topicName;
//         const chats = await Chat.find({ sessionId: element });
//         chats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//         chats.forEach(chat => {
//             chat.sender == 'human' ? chat_data['human'] = chat.message : chat_data['ai'] = chat.message;
//             json_data.chats.push(chat_data);
//         })
//         data.push(json_data);
//     });
//     res.json(data);
// })
