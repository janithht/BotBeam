import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

dotenv.config();

async function addComment(owner, repo, issue_number, body) {
  try {
    const installationId = process.env.GITHUB_INSTALLATION_ID;
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

export default addComment;