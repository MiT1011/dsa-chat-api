import { Schema, model, mongoose } from 'mongoose';

const SessionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
    sessionName: {
        type: String,
        default: () => new Date().toISOString(),
        required: true
    },
    topicName: {
        type: String, required: true
    },
    createdAt: { type: Date, default: Date.now }
});

export default model('Session', SessionSchema);
