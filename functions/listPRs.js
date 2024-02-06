import axios from 'axios';
import { getAccessToken } from './tokenStore.js'; // Assuming this function exists and works similarly to your listRepositories function

const listPullRequests = async (owner, repo) => {
    try {
        const accessToken = getAccessToken();
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const pullRequests = response.data;
        if (pullRequests.length === 0) {
            console.log('No open pull requests found for this repository.');
            return;
        }

        pullRequests.forEach(pr => {
            console.log(`#${pr.number} - ${pr.title} by ${pr.user.login} (${pr.state}, ${pr.created_at})`);
        });
    } catch (error) {
        console.error('Failed to list pull requests:', error);
    }
};

export default listPullRequests;