const express = require('express');
const router = express.Router();
const { readBooks, writeBooks } = require('../utils/fileOperations');

// GET /api/books - Get all books
router.get('/', async (req, res) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (error) {
    console.error('Error reading books:', error);
    res.status(500).json({ error: 'Failed to read books' });
  }
});

// POST /api/books - Add a new book
router.post('/', async (req, res) => {
  try {
    const { title, author, rating, note } = req.body;

    // Validation
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const books = await readBooks();

    // Create new book object
    const newBook = {
      id: Date.now().toString(), // Simple ID generation using timestamp
      title: title.trim(),
      author: author.trim(),
      rating: rating ? parseInt(rating) : null,
      note: note ? note.trim() : '',
      createdAt: new Date().toISOString(),
    };

    books.push(newBook);
    await writeBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, rating, note } = req.body;

    const books = await readBooks();
    const bookIndex = books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Update book properties
    if (title !== undefined) books[bookIndex].title = title.trim();
    if (author !== undefined) books[bookIndex].author = author.trim();
    if (rating !== undefined) books[bookIndex].rating = rating ? parseInt(rating) : null;
    if (note !== undefined) books[bookIndex].note = note.trim();
    books[bookIndex].updatedAt = new Date().toISOString();

    await writeBooks(books);

    res.json(books[bookIndex]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE /api/books/:id - Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const books = await readBooks();
    const filteredBooks = books.filter((book) => book.id !== id);

    if (books.length === filteredBooks.length) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await writeBooks(filteredBooks);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;

