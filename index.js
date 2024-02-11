#!/usr/bin/env node

/**
 * BotBeam
 * CLI to install BOTs in GitHub repositories
 * 
 * @author Janith Hathnagoda
 */
import readline from 'readline';
import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';
import addComment from './functions/commentOnPR.js';
import handleOAuth from './functions/oauthHandler.js';
import listRepositories from './functions/listRepositories.js';
import listPullRequests from './functions/listPRs.js';
import fetchRepoStats from './functions/stats.js';
import closePullRequest from './functions/closePR.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
import boxen from 'boxen';
import { response } from 'express';
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green('BotBeam> ')
});

const { clear, debug } = cli.flags;

init({ clear });
if (debug) {
    log(cli.flags);
}

let oauthTokenObtained = false;

console.log(boxen(chalk.yellow('Welcome to BotBeam CLI\n') + chalk.blue('CLI to install BOTs in GitHub repositories'), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'green',
}));

rl.prompt();

rl.on('line', async (line) => {
    const input = line.trim();
    const args = input.split(' ');
    switch (args[0].toLowerCase()) {
        case 'help':
            console.log(chalk.magenta('Available commands: help, install, list, stats, comment, close, exit'));
            console.log("");
            break;
        case 'install':
            console.log(chalk.green('Initiating BOT installation...'));
            await handleOAuth();
            oauthTokenObtained = true;
            console.log("");
            break;
        case 'list':
            if (!oauthTokenObtained) {
                console.log(chalk.red('You must install a BOT before listing.'));
                break;
            }
            if (args[1] === 'prs' && args.length >= 4) {
                await listPullRequests(args[2], args[3]);
            } else if (args[1] === 'repos') {
                await listRepositories();
            } else {
                console.log(chalk.red('Invalid list command. Use "list prs owner repo" or "list repos"'));
            }
            console.log("");
            break;
        case 'stats':
                await fetchRepoStats(args[1], args[2]);
            console.log("");
            break;
        case 'comment':
            if (args.length >= 5) {
                // Removes quotes from the start and end of the comment if present
                const comment = args.slice(5).join(' ').replace(/^"|"$/g, '');
                try {
                    // Call addComment function directly with the appropriate arguments
                    const response = await addComment(args[2], args[3], args[4], comment);
                    console.log(chalk.green(response.message));
                } catch (error) {
                    console.error(chalk.red('Failed to add comment:', response.message));
                }
            } else {
                console.log(chalk.yellow('Invalid command format. Expected: comment pr owner repo prNumber "comment"'));
            }
            break;                
        case 'close':
            if (args[1] === 'pr' && args.length >= 5) {
                if (oauthTokenObtained) {
                    closePullRequest(args[2], args[3], args[4]);
                } else {
                    console.log(chalk.red('You must install the BOT before closing pull requests.'));
                }
            } else {
                console.log(chalk.yellow('Invalid command format. Expected: close pr owner repo prNumber'));
            }
            console.log("");
            break;
        case 'exit':
            console.log(chalk.blue('Exiting BotBeam CLI.'));
            rl.close();
            console.log("");
            return;
        default:
            console.log(chalk.red('Unknown command:'), input);
            console.log("");
            break;
    }
    rl.prompt();
}).on('close', () => {
    console.log(chalk.green('Goodbye!'));
    process.exit(0);
});