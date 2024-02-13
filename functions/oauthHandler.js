// oauthHandler.js

import express from 'express';
import axios from 'axios';
import open from 'open';
import fs from 'fs';
import dotenv from 'dotenv';
import http from 'http';
import chalk from 'chalk';

dotenv.config();
const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

async function handleOAuth() {
    
    // Start a temporary server to handle the OAuth callback
    //const port = await getAvailablePort();
    const port = 5000;
    const app = express();
    const server = app.listen(port, () => {
        
        console.log(`Temporary server running on http://localhost:${port}`);
        open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=repo`);
    });

    app.get('/github/callback', async (req, res) => {
        const code = req.query.code;
        if (!code) {
            // Respond to the client indicating the error
            res.status(400).send("Authorization code is missing. Please ensure you're coming from a valid GitHub OAuth flow.");
            return; // Early return to prevent further execution
        }
        
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
            if(!accessToken){
                res.send('Authentication failed');
                return;
            }
            setAccessToken(accessToken);

            const appInstallationUrl = `https://github.com/apps/codecommentor/installations/new`;
            res.redirect(appInstallationUrl);
            console.log(chalk.green('Authentication successful'));            
            } catch (error) {
            console.error('Error exchanging code for token', error);
            res.send('Authentication failed');
            } 

            server.close();
            process.exit(0);    
            
    });
};

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
      const server = http.createServer();
      server.listen(0, () => {
          const port = server.address().port;
          server.close(() => resolve(port));
      });
      server.on('error', reject);
  });
}

function setAccessToken(token) {
    fs.writeFileSync("token.txt", token, "utf-8");
  }

function getAccessToken() {
    return fs.readFileSync("token.txt", "utf-8");
}

export { handleOAuth, setAccessToken, getAccessToken};

