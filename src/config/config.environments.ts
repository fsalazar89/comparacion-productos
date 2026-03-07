// config.ts
import dotenv from 'dotenv';
const path = require('path');
const projectRoot = process.cwd();

let ambiente;
if (process.argv.includes('--local')) {
    ambiente = path.join(projectRoot, '/environments/.env.local');
}

dotenv.config({ path: ambiente, debug: false });