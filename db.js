// db.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DB_URL
});

async function getFilesInFolder(folderId) {
    const query = 'SELECT id, filename_disk FROM directus_files WHERE folder = $1';
    const values = [folderId];
    try {
        const res = await pool.query(query, values);
        return res.rows;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function updateFileValidity(fileId, isValid) {
    const query = 'UPDATE directus_files SET is_valid = $1 WHERE id = $2';
    const values = [isValid, fileId];
    try {
        await pool.query(query, values);
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    getFilesInFolder,
    updateFileValidity,
};
