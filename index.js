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
import handleOAuth from './functions/oauthHandler.js';
import listRepositories from './functions/listRepositories.js';
import dotenv from 'dotenv';
dotenv.config();
 // Import the OAuth handler

 const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const { clear, debug } = cli.flags;

init({ clear });
debug && log(cli.flags);

let oauthTokenObtained = false; // State to track if OAuth token has been obtained

const promptUser = () => {
    rl.question('BotBeam> ', async (input) => {
        const args = input.split(' ');
        switch (args[0]) {
            case 'help':
                cli.showHelp(0);
                break;
            case 'install':
                console.log('Initiating BOT installation...');
                await handleOAuth();
                oauthTokenObtained = true; // Assume OAuth token is obtained after handleOAuth() is called
                break;
            case 'list':
                if (args[1] === 'repos') {
                    if (oauthTokenObtained) {
                        await listRepositories();
                    } else {
                        console.log('You must install a BOT before listing repositories.');
                    }
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
        promptUser(); // Re-prompt the user for the next command
    });
};

promptUser(); // Initial prompt

rl.on('close', () => {
    process.exit(0);
});
