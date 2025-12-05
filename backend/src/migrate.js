require('dotenv').config();
const pool = require('./config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    try {
        const sql = fs.readFileSync(path.join(__dirname, './db/setup.sql'), 'utf8');
        await pool.query(sql);
        console.log('✅ Tables created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();