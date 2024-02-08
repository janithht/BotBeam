import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json())

app.post('/comment-pr', async (req, res) => {
  const { owner, repo, prNumber, comment } = req.body;

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
          owner,
          repo,
          issue_number: prNumber,
          body: comment,
      });

      console.log('Comment added to PR');
      res.status(200).json({ message: 'Comment successfully added to PR' });
  } catch (error) {
      console.error('Failed to add comment:', error);
      res.status(500).json({ message: 'Failed to add comment' });
  }
});

app.post('/webhook', async (req, res) => {
    try {
      if (req.body.action === 'opened' && req.body.pull_request) {
        process.env.GITHUB_INSTALLATION_ID = req.body.installation.id;
      }
      res.status(200).send('OK');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});