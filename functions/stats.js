import axios from 'axios';
import { getAccessToken } from './tokenStore.js';

async function fetchRepoStats(owner, repo) {
    const accessToken = getAccessToken();
    const headers = {
        Authorization: `token ${accessToken}`, // Ensure yourOAuthToken is correctly defined
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        // Fetch open pull requests
        const prs = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers });

        // Fetch open issues (GitHub counts pull requests as issues, so they must be excluded)
        const issues = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, { headers });

        // Fetch contributors
        const contributors = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });

        // Fetch commits to get the last commit date
        const commits = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });

        return {
            openPullRequests: prs.data.length,
            openIssues: issues.data.length - prs.data.length, // Subtract PRs from issues count
            contributorsCount: contributors.data.length,
            lastCommitDate: commits.data[0].commit.committer.date,
        };
    } catch (error) {
        console.error('Failed to fetch repository statistics:', error);
        throw error; // Rethrow error for further handling
    }
}

export default fetchRepoStats;