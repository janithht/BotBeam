import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
dotenv.config();

async function addComment(owner, repo, issue_number, body) {
  try {
    const installationId = await getInstallationId(owner, repo);
    if (!installationId) {
      console.error('Failed to get installation ID');
      return;
    }
    
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
        installationId: installationId,
      },
    });

    await octokit.rest.issues.createComment({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      body: body,
    });

    // Adding labels to the PR/Issue
    await octokit.rest.issues.addLabels({
      owner: owner,
      repo: repo,
      issue_number: issue_number,
      labels: ['BuildFailure'] 
    });

    return { status: 'success', message: 'Comment added to PR' };
  } catch (error) {
      throw new Error(`Failed to add comment: ${error.message}`);
  }
}

async function getInstallationId(owner, repo) {
    const octokit = new Octokit({
      authStrategy: createAppAuth,
      auth: {
        appId: process.env.GITHUB_APP_ID,
        privateKey: process.env.GITHUB_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });
  
    try {
      const response = await octokit.rest.apps.getRepoInstallation({
        owner,
        repo,
      });
  
      // Assuming installation exists for the repo (handle errors accordingly)
      const installationId = response.data.id;
      return installationId;
    } catch (error) {
      throw new Error('Failed to get installation ID:', error);
    }
  }

export default addComment;