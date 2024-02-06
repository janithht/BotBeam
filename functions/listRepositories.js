import axios from 'axios';
import { getAccessToken } from './tokenStore.js';

const listRepositories = async () => {
    try {
        const accessToken = getAccessToken();
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        const repositories = response.data;

        // Determine the longest repository name for formatting
        const longestNameLength = repositories.reduce((max, repo) => Math.max(max, repo.name.length), 0);

        // Generate a formatted string for each repository name, ensuring each name is padded to align in columns
        const formattedNames = repositories.map(repo => repo.name.padEnd(longestNameLength + 4, ' ')); // Adding 4 spaces for padding between columns

        // Group names into columns (assuming a desired width, e.g., 3 columns)
        const columns = 3;
        for (let i = 0; i < formattedNames.length; i += columns) {
            const row = formattedNames.slice(i, i + columns).join('');
            console.log(row);
        }
    } catch (error) {
        console.error('Failed to list repositories:', error);
    }
};

export default listRepositories;