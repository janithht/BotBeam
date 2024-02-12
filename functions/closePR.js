import axios from 'axios';
import { getAccessToken } from './oauthHandler.js';


async function closePullRequest(owner, repo, prNumber) {
    try {
        const accessToken = getAccessToken();
        const response = await axios.patch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`, {
            state: "closed"
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`, 
                Accept: 'application/vnd.github.v3+json'
            },
        });
        console.log(`Pull request #${prNumber} closed: ${response.data.state}`);
    } catch (error) {
        console.error('Failed to close pull request:', error);
    }
}

export default closePullRequest;