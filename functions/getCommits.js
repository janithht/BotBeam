import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a new Octokit instance with your GitHub Personal Access Token
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  async function getCommitsByBranch(owner, repo, branch) {
    const commits = [];

    try {
        // Using the octokit.paginate method to automatically handle pagination
        const response = await octokit.paginate(octokit.rest.repos.listCommits, {
            owner,
            repo,
            sha: branch, // Use the branch name to filter commits
        }, (response) => response.data.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            url: commit.html_url,
            date: commit.commit.author.date,
        })));

        // Concatenate the commits from each page
        commits.push(...response);

        return commits;
    } catch (error) {
        console.error('Error fetching commits:', error);
        throw error;
    }
}

  export { getCommitsByBranch };
  