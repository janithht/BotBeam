#!/usr/bin/env node

/**
 * BotBeam
 * CLI to install BOTs in GitHub repositories
 * 
 * @author Janith Hathnagoda
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';
import handleOAuth from './oauthHandler.js';
import dotenv from 'dotenv';
dotenv.config();
 // Import the OAuth handler

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
    init({ clear });
    input.includes(`help`) && cli.showHelp(0);
    debug && log(flags);

    if(input.includes(`install`)){
        console.log('Initiating BOT installation...');
        handleOAuth(); // Use the OAuth handler for the installation process
    }
})();
