import axios from 'axios';
import { getAccessToken } from './tokenStore.js';
import chalk from 'chalk';
import boxen from 'boxen';

async function fetchRepoStats(owner, repo) {
    const accessToken = getAccessToken();
    const headers = {
        Authorization: `Bearer ${accessToken}`, // Updated to Bearer for consistency
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        const prs = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers });
        const issues = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, { headers });
        const contributors = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });
        const commits = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });

        // Prepare stats with visual enhancements
        const statsFormatted = `
${chalk.bold('Repository Statistics for')} ${chalk.green(`${owner}/${repo}`)}:
${chalk.bold('- Open Pull Requests:')} ${chalk.yellow(prs.data.length)}
${chalk.bold('- Open Issues (excluding PRs):')} ${chalk.yellow(issues.data.length - prs.data.length)}
${chalk.bold('- Contributors:')} ${chalk.yellow(contributors.data.length)}
${chalk.bold('- Last Commit Date:')} ${chalk.yellow(commits.data[0].commit.committer.date)}
`;

        // Use boxen for displaying the stats
        console.log(boxen(statsFormatted, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
            backgroundColor: '#555555'
        }));

        // Return the raw data in case it needs to be used programmatically
        return {
            openPullRequests: prs.data.length,
            openIssues: issues.data.length - prs.data.length,
            contributorsCount: contributors.data.length,
            lastCommitDate: commits.data[0].commit.committer.date,
        };
    } catch (error) {
        console.error(chalk.red('Failed to fetch repository statistics:'), error);
        throw error;
    }
}

export default fetchRepoStats;
