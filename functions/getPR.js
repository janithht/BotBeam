import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

// Initialize a new Octokit instance with your GitHub Personal Access Token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function findPRsByCommit(owner, repo, commitHash) {
  try {
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listPullRequestsAssociatedWithCommit, {
      owner,
      repo,
      commit_sha: commitHash,
      mediaType: {
        previews: ['groot'], // This preview header is necessary for the API to include draft PRs
      },
    });

    // An array to collect all pull requests across pages
    let allPullRequests = [];

    // Loop through each page of results
    for await (const { data: pullRequests } of iterator) {
      allPullRequests = allPullRequests.concat(pullRequests.map(pr => ({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        state: pr.state,
        headBranch: pr.head.ref, // Add the branch from which the PR originates
        baseBranch: pr.base.ref, // Optionally, include the target branch of the PR
      })));
    }

    return allPullRequests;
  } catch (error) {
    console.error('Error fetching PRs:', error);
    throw error;
  }
}

async function findPRsByBranchAndCommit(owner, repo, headBranch, commitHash) {
  try {
    const iterator = octokit.paginate.iterator(octokit.rest.repos.listPullRequestsAssociatedWithCommit, {
      owner,
      repo,
      commit_sha: commitHash,
      mediaType: {
        previews: ['groot'], // This preview header includes draft PRs
      },
    });

    let allPullRequests = [];

    for await (const { data: pullRequests } of iterator) {
      // Filter pull requests by the head branch
      const filteredPRs = pullRequests.filter(pr => pr.head.ref === headBranch).map(pr => ({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        state: pr.state,
        headBranch: pr.head.ref,
        baseBranch: pr.base.ref,
      }));

      allPullRequests = allPullRequests.concat(filteredPRs);
    }

    return allPullRequests;
  } catch (error) {
    console.error('Error fetching PRs:', error);
    throw error;
  }
}


export { findPRsByCommit, findPRsByBranchAndCommit };