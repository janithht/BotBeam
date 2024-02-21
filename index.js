#!/usr/bin/env node

/**
 * BotBeam
 * CLI to install BOTs in GitHub repositories
 * 
 * @author Janith Hathnagoda
 */
import chalk from 'chalk';
import { Command } from 'commander';
import dotenv from 'dotenv';
import {handleOAuth} from './functions/oauthHandler.js';
import listRepositories from './functions/listRepositories.js';
import listPullRequests from './functions/listPRs.js';
import fetchRepoStats from './functions/stats.js';
import addComment from './functions/commentOnPR.js';
import {findPRsByCommit, findPRsByBranchAndCommit} from './functions/getPR.js';
import { getCommitsByBranch } from './functions/getCommits.js';
import closePullRequest from './functions/closePR.js';

dotenv.config();

const program = new Command();

program
  .name('BotBeam')
  .description('CLI to install BOTs in GitHub repositories')
  .version('1.0.0');

program.command('install')
  .description('Initiate BOT installation')
  .action(async () => {
    console.log(chalk.green('Initiating BOT installation...'));
    await handleOAuth();
    console.log("");
  });


program.command('list-repos')
  .description('List all repositories')
  .action(async () => {
    await listRepositories();
    console.log("");
  });

program.command('list-prs')
  .description('List pull requests for a given repository')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .action(async (options) => {
    await listPullRequests(options.owner, options.repo);
    console.log("");
  });

program.command('stats')
  .description('Fetch repository statistics')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .action(async (options) => {
    await fetchRepoStats(options.owner, options.repo);
    console.log("");
  });

program.command('comment')
  .description('Add a comment to a pull request')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .requiredOption('-p, --prNumber <prNumber>', 'Pull request number')
  .requiredOption('-c, --comment <comment>', 'Comment text')
  .action(async (options) => {
    const response = await addComment(options.owner, options.repo, options.prNumber, options.comment);
    console.log(chalk.green(response.status,response.message));
    console.log("");
  });

program.command('get-prs-commit')
  .description('Get pull requests associated with a relevant commit hash')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .requiredOption('-h, --Hash <Hash>', 'Commit Hash')
  .action(async (options) => {
    try {
      const prs = await findPRsByCommit(options.owner, options.repo, options.Hash);
      console.log("Pull Requests:");
      console.log(prs);
    } catch (error) {
      console.error('Failed to fetch PRs:', error);
    }
    console.log("");
  });
  
program.command('get-prs-branch-commit')
  .description('Get pull requests associated with a relevant commit hash')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .requiredOption('-b, --branch <branch>', 'Branch Name')
  .requiredOption('-h, --Hash <Hash>', 'Commit Hash')
  .action(async (options) => {
    try {
      const prs = await findPRsByBranchAndCommit(options.owner, options.repo, options.branch, options.Hash);
      console.log("Pull Requests:");
      console.log(prs);
    } catch (error) {
      console.error('Failed to fetch PRs:', error);
    }
    console.log("");
  });

program.command('get-commits-branch')
  .description('Get pull requests associated with a relevant commit hash')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .requiredOption('-b, --branch <branch>', 'Branch Name')
  .action(async (options) => {
    try {
      const commits = await getCommitsByBranch(options.owner, options.repo, options.branch);
      console.log("Pull Requests:");
      console.log(commits);
    } catch (error) {
      console.error('Failed to fetch PRs:', error);
    }
    console.log("");
  });

program.command('close')
  .description('Close a pull request')
  .requiredOption('-o, --owner <owner>', 'Owner of the repository')
  .requiredOption('-r, --repo <repo>', 'Name of the repository')
  .requiredOption('-p, --prNumber <prNumber>', 'Pull request number')
  .action(async (options) => {
    await closePullRequest(options.owner, options.repo, options.prNumber);
    console.log("");
  });

program.parse();

