// oauthHandler.js

import express from 'express';
import axios from 'axios';
import open from 'open';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const handleOAuth = async() => {
    
    // Start a temporary server to handle the OAuth callback
    const app = express();
    const server = app.listen(3000, () => {
        console.log('Temporary server running on http://localhost:3000');
        const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`;
        open(url).then(() => {
            console.log('Browser opened successfully');
        }).catch(err => {
            console.error('Failed to open browser:', err);
        });
    });

    app.get('/github/callback', async (req, res) => {
        const code = req.query.code;
        try {
            const response = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: clientId,
                client_secret: clientSecret,
                code,
            }, {
                headers: {
                    Accept: 'application/json',
                },
            });

            const accessToken = response.data.access_token;
            console.log('Access Token:', accessToken);
            res.send('Authentication successful! You can close this window.');

            // Redirect or instruct the user to install the GitHub App
            console.log(`Please install the GitHub App using this link: https://github.com/apps/your-app-name/installations/new`);
        } catch (error) {
            console.error('Error exchanging code for token', error);
            res.send('Authentication failed');
        } finally {
            server.close();
        }
    });
};

export default handleOAuth;
