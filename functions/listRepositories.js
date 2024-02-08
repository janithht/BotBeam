import axios from 'axios';
import { getAccessToken } from './tokenStore.js';
import chalk from 'chalk';
import boxen from 'boxen';

const listRepositories = async () => {
    try {
        const accessToken = getAccessToken();
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const repositories = response.data;

        // Sorting repositories by name for a consistent order
        repositories.sort((a, b) => a.name.localeCompare(b.name));

        // Determine the longest repository name for formatting
        const longestNameLength = repositories.reduce((max, repo) => Math.max(max, repo.name.length), 0);

        console.log(chalk.bold('Your GitHub Repositories:\n'));

        // Generate a formatted string for each repository name
        const formattedNames = repositories.map(repo => {
            // Color and emoji based on repository visibility
            const name = repo.private ? chalk.red(repo.name) : chalk.green(repo.name);
            const visibility = repo.private ? chalk.red('🔒') : chalk.green('🌍');

            return `${visibility} ${name.padEnd(longestNameLength + 4)}`; // Adding padding for alignment
        });

        // Group names into columns for a better layout, e.g., 2 columns
        const columns = 2;
        let boxContent = '';
        for (let i = 0; i < formattedNames.length; i += columns) {
            const row = [];
            for (let j = 0; j < columns; j++) {
                if (i + j < formattedNames.length) {
                    // Add the repository name
                    row.push(formattedNames[i + j]);
                }
            }
            // Check if the first column is present, then pad it to ensure the second column aligns right
            if (row[0]) {
                row[0] = row[0].padEnd(longestNameLength + 10, ' '); // Increase spacing before the second column
            }
            boxContent += row.join('') + '\n'; // Join the columns without additional spacing, as padding is already added
        }

        // Use boxen to display the repositories in a visually appealing box
        console.log(boxen(boxContent, {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'blue',
            backgroundColor: '#555555'
        }));

    } catch (error) {
        console.error(chalk.red('Failed to list repositories:'), error);
    }
};

export default listRepositories;
