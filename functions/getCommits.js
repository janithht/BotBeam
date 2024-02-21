import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a new Octokit instance with your GitHub Personal Access Token
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

async function getCommitsByBranch(owner, repo, branch) {
    try {
      const response = await octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: branch, // Use the branch name to filter commits
      });
  
      // Process the response to get a simplified list of commit information
      const commits = response.data.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        url: commit.html_url,
        date: commit.commit.author.date,
      }));
  
      return commits;
    } catch (error) {
      console.error('Error fetching commits:', error);
      throw error;
    }
  }

  export { getCommitsByBranch };
  