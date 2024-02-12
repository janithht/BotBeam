#!/usr/bin/env node

/**
 * BotBeam
 * CLI to install BOTs in GitHub repositories
 * 
 * @author Janith Hathnagoda
 */
import winston from 'winston';
import { Command } from 'commander';
import dotenv from 'dotenv';
import {handleOAuth} from './functions/oauthHandler.js';
import listRepositories from './functions/listRepositories.js';
import listPullRequests from './functions/listPRs.js';
import fetchRepoStats from './functions/stats.js';
import addComment from './functions/commentOnPR.js';
import closePullRequest from './functions/closePR.js';
import chalk from 'chalk';

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
    await addComment(options.owner, options.repo, options.prNumber, options.comment);
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

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});
