import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a new Octokit instance with your GitHub Personal Access Token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function findPRsByCommit(owner, repo, commitHash) {
  try {
    // Fetch the pull requests associated with the commit
    const { data: pullRequests } = await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner,
      repo,
      commit_sha: commitHash,
      mediaType: {
        previews: ['groot'], // This preview header is necessary for the API to include draft PRs
      },
    });

    // Extract relevant information from the pull requests
    return pullRequests.map(pr => ({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      state: pr.state,
    }));
  } catch (error) {
    console.error('Error fetching PRs:', error);
    throw error;
  }
}


export default findPRsByCommit;