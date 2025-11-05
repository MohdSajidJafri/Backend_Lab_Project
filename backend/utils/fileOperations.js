const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/books.json');

// Read books from JSON file
async function readBooks() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Write books to JSON file
async function writeBooks(books) {
  // Ensure data directory exists
  const dataDir = path.dirname(DATA_FILE);
  await fs.mkdir(dataDir, { recursive: true });

  // Write books array to JSON file
  await fs.writeFile(DATA_FILE, JSON.stringify(books, null, 2), 'utf8');
}

module.exports = {
  readBooks,
  writeBooks,
};

