import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport'; // Import passport explicitly
import '../config/passport.js'; // Ensure the passport configuration is loaded
import crypto from 'crypto';

const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log(jwtSecret);

const router = express.Router();

/* 
Login Route
GET Endpoint: http://localhost:3000/auth/google
*/
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    try {
        const token = jwt.sign({ id: req.user.id }, jwtSecret, { expiresIn: '1h' });
        console.log('SUCCESS');
        res.json({ token });
    } catch (error) {
        console.error('Error generating JWT:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


/*
Verify the token
*/

// API endpoint to verify JWT token
//POST Endpoint: http://localhost:3000/auth/verify-token
router.post('/verify', (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ verified: false, error: 'No token provided' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // Token verification failed
            return res.status(401).json({ verified: false, error: 'Failed to authenticate token' });
        }

        // If token is verified, add decoded information to request for further use
        req.user = decoded;
                
        // Send a response indicating the token is verified
        res.json({ verified: true });
    });
});

export { router as authRoutes };
