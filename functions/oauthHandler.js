// oauthHandler.js

import express from 'express';
import axios from 'axios';
import open from 'open';
import { setAccessToken } from './tokenStore.js';
import dotenv from 'dotenv';

dotenv.config();
const clientId = "Iv1.8891ec172d49e757";
const clientSecret = "102a007a9c00abd57cf0f4daec9bd7b97d10dfd2";

const handleOAuth = async() => {
    
    // Start a temporary server to handle the OAuth callback
    const app = express();
    const server = app.listen(3000, () => {
        
        console.log('Temporary server running on http://localhost:3000');
        open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`);
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
            setAccessToken(accessToken);

            const appInstallationUrl = `https://github.com/apps/codecommentor/installations/new`;
            res.redirect(appInstallationUrl);
            
            } catch (error) {
            console.error('Error exchanging code for token', error);
            res.send('Authentication failed');
            } 

            server.close();
            
    });
};

export default handleOAuth;
