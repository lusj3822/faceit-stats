const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const path = './src/environments/environment.prod.ts';

const apiKey = process.env.FACEIT_API_KEY;

const content = `
export const environment = {
  production: true,
  apiKey: '${apiKey || ''}'
};
`;

fs.writeFileSync(path, content.trim() + '\n');
