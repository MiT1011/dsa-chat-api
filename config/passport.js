import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import dotenv from 'dotenv';
dotenv.config();

// const proxy = 'http://proxy.iind.intel.com:912';
// const agent = new HttpsProxyAgent(proxy);
// console.log(process.env.GOOGLE_CLIENT_ID);

const gStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/redirect',
    // agent: agent
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('Profile:', profile);
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                username: profile.displayName,
                email: profile.emails?.[0].value,
                picture: profile.photos[0].value,
            });
            await user.save();
        }
        done(null, user);
    } catch (err) {
        done(err);
    }
});
// gStrategy._oauth2.setAgent(agent);
passport.use(gStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export default passport;
