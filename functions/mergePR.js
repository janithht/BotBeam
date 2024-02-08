import axios from 'axios';
import { getAccessToken } from './tokenStore.js';

async function mergePullRequest(owner, repo, prNumber) {
    try {
        const accessToken = getAccessToken();
        const response = await axios.put(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/merge`, {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Replace yourOAuthToken with actual OAuth token variable
                Accept: 'application/vnd.github.v3+json'
            },
        });
        console.log(`Pull request #${prNumber} merged: ${response.data.message}`);
    } catch (error) {
        console.error('Failed to merge pull request:', error);
    }
}

export default mergePullRequest;