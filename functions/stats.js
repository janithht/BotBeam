import axios from 'axios';
import { getAccessToken } from './oauthHandler.js';
import chalk from 'chalk';
import boxen from 'boxen';

async function fetchRepoStats(owner, repo) {
    const accessToken = getAccessToken();
    const headers = {
        Authorization: `Bearer ${accessToken}`, 
        Accept: 'application/vnd.github.v3+json',
    };

    try {
        const prs = await axios.get(`https://api.github.com/repos/${owner}/${repo}/pulls?state=open`, { headers });
        const issues = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues?state=open`, { headers });
        const contributors = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors`, { headers });
        const commits = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });

        
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
