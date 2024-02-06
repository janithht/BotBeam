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
        console.log('Repositories:', repositories.map(repo => repo.name).join(', '));
    } catch (error) {
        console.error('Failed to list repositories:', error);
    }
};

export default listRepositories;