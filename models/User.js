import { Schema, model, mongoose } from 'mongoose';

const UserSchema = new Schema({
    googleId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }]
});

const User = model('User', UserSchema);
export default User;
