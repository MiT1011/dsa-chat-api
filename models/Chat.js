// models/Chat.js
import { Schema, model, mongoose } from 'mongoose';

const ChatSchema = new Schema({
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
    sender: { type: String, enum: ['human', 'ai'], required: true },
    message: { type: String },
    // additional_kwargs: { type: Map, default: {} },
    // response_metadata: { type: Map, default: {} },
    // name: { type: String, default: null },
    // id: { type: Number, default: null },
    // example: { type: Boolean, default: false },
    // tool_calls: { type: Array, default: [] },
    // invalid_tool_calls: { type: Array, default: [] },
    // usage_metadata: { type: Map, default: {} },
    timestamp: { type: Date, default: Date.now }
});

// ChatSchema.pre('save', function (next) {
//     if (this.sender === 'bot') {
//         this.tool_calls = this.tool_calls || [];
//         this.invalid_tool_calls = this.invalid_tool_calls || [];
//         this.usage_metadata = this.usage_metadata || {};
//     } else {
//         this.tool_calls = undefined;
//         this.invalid_tool_calls = undefined;
//         this.usage_metadata = undefined;
//     }
//     next();
// });

const Chat = model('Chat', ChatSchema);
export default Chat;


// From Frontend to AI code

// {
//     'userId': '66f7099c1401b33e74f4636e',
//     'sessionId': '66f709f81401b33e74f46370',
//     'topicName': 'linkedlist',
//     'chatType': 'question',
//     'userPrompt': 'Hello',
//     'history': [{'user': 'Hi There', 'ai': 'Yes!'}, {'user': 'I am human', 'ai': 'I am AI'}]
// }


// From HAP to Sreejani

// [
//     {
//         "sesionId": "s1",
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
//     },
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

// AI to DB

// {
//     "userid" : "",
//     "session_id": "",
//     "topic_name": "",
//     "user_que": "",
//     "ai_ans": ""
// }

// Sreejani ko dena h woh banana -> Done
// Delete API for session - > Done
// api to accept data from AI
// add tpoicName to Session -> Done