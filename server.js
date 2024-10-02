import app from './app.js';
import https from 'https';
https.globalAgent.options.rejectUnauthorized = false;
// require('https').globalAgent.options.rejectUnauthorized = false;
// Using ES6 import syntax
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;

console.log(PORT);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
