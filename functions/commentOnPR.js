import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';
dotenv.config();

async function addComment(owner, repo, issue_number, body) {
  try {
    const installationId = await getInstallationId(owner, repo);
    if(!installationId) throw new Error('Failed to get installation ID');
    
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
      return{status: 'success', message: 'Comment added to PR'};
  } catch (error) {
      throw new error('Failed to add comment:', error);
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