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
import axios from 'axios';
import handleOAuth from './functions/oauthHandler.js';
import listRepositories from './functions/listRepositories.js';
import listPullRequests from './functions/listPRs.js';
import fetchRepoStats from './functions/stats.js';
import closePullRequest from './functions/closePR.js';
import dotenv from 'dotenv';
dotenv.config();
 // Import the OAuth handler

 const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'BotBeam> '
});

const { clear, debug } = cli.flags;

init({ clear });
debug && log(cli.flags);

let oauthTokenObtained = false; // State to track if OAuth token has been obtained

rl.on('line', async (line) => {
    const input = line.trim();
    const args = input.split(' ');
    switch (args[0]) {
            case 'help':
                cli.showHelp(0);
                break;
            case 'install':
                console.log('Initiating BOT installation...');
                await handleOAuth();
                oauthTokenObtained = true; // OAuth token is obtained after handleOAuth() is called
                break;
            case 'list':
                if (args[1] === 'prs' && args.length >= 4) {
                    const owner = args[2]; // format is: list prs owner repo
                    const repo = args[3];
                    if (oauthTokenObtained) {
                        await listPullRequests(owner, repo);
                    } else {
                        console.log('You must install a BOT before listing pull requests.');
                    }
                } else if (args[1] === 'repos') {
                    if (oauthTokenObtained) {
                        await listRepositories();
                    } else {
                        console.log('You must install a BOT before listing repositories.');
                    }
                }
                console.log('');
                break;
            case 'stats':
                if (args.length >= 3) {
                    const owner = args[1];
                    const repo = args[2];
                    
                    fetchRepoStats(owner, repo)
                        .then(stats => {
                            console.log(`Statistics for ${owner}/${repo}:`);
                            console.log(`Open Pull Requests: ${stats.openPullRequests}`);
                            console.log(`Open Issues: ${stats.openIssues}`);
                            console.log(`Contributors: ${stats.contributorsCount}`);
                            console.log(`Last Commit Date: ${stats.lastCommitDate}`);
                        })
                        .catch(error => {
                            console.log('Error fetching stats:', error.message);
                        });
                } else {
                    console.log('Invalid command format. Expected: stats owner repo');
                }
                break;
            case 'comment':
                if (args[1] === 'pr' && args.length >= 5) {
                    const owner = args[2];
                    const repo = args[3];
                    const prNumber = args[4];
                    const comment = args.slice(5).join(' ').replace(/^"|"$/g, '');

                    // Server is running locally on port 3000
                    const serverUrl = 'http://localhost:3000/comment-pr';

                    axios.post(serverUrl, { owner, repo, prNumber, comment })
                        .then(response => console.log(response.data.message))
                        .catch(error => console.error('Failed to send comment command:', error));
                } else {
                    console.log('Invalid command format. Expected: comment pr owner repo prNumber "comment"');
                }
                console.log('');
                break;
            case 'close':
                if (args[1] === 'pr' && args.length >= 5) { 
                    const owner = args[2]; 
                    const repo = args[3]; 
                    const prNumber = args[4]; 
                    if (oauthTokenObtained) {
                        closePullRequest(owner, repo, prNumber);
                    } else {
                        console.log('You must install the BOT before closing pull requests.');
                    }
                } else {
                    console.log('Invalid command format. Expected: close pr owner repo prNumber');
                }
                break;
            case 'exit':
                console.log('Exiting BotBeam CLI.');
                rl.close();
                return;
            default:
                console.log('Unknown command:', input);
                break;
        }
        rl.prompt(); // Re-prompt after handling the command
    }).on('close', () => {
        console.log('Goodbye!');
        console.log('');
        process.exit(0);
    });

    rl.prompt(); // Show the initial prompt