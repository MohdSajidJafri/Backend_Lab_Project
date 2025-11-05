// API Base URL
const API_BASE_URL = '/api/books';

// DOM Elements
const bookForm = document.getElementById('bookForm');
const booksList = document.getElementById('booksList');
const emptyState = document.getElementById('emptyState');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const cancelEditBtn = document.getElementById('cancelEdit');
const averageRatingDiv = document.getElementById('averageRating');
const avgRatingValue = document.getElementById('avgRatingValue');
const avgRatingStars = document.getElementById('avgRatingStars');

// Load books when page loads and attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  attachEventListeners();
  loadBooks();
});

// Handle form submission for adding a new book
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(bookForm);
  const bookData = {
    title: formData.get('title'),
    author: formData.get('author'),
    rating: formData.get('rating') || null,
    note: formData.get('note') || '',
  };

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (response.ok) {
      bookForm.reset();
      loadBooks();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error || 'Failed to add book'}`);
    }
  } catch (error) {
    console.error('Error adding book:', error);
    alert('Failed to add book. Please try again.');
  }
});

// Handle form submission for editing a book
editForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookId = document.getElementById('editId').value;
  const bookData = {
    title: document.getElementById('editTitle').value,
    author: document.getElementById('editAuthor').value,
    rating: document.getElementById('editRating').value || null,
    note: document.getElementById('editNote').value || '',
  };

  try {
    const response = await fetch(`${API_BASE_URL}/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });

    if (response.ok) {
      closeEditModal();
      loadBooks();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error || 'Failed to update book'}`);
    }
  } catch (error) {
    console.error('Error updating book:', error);
    alert('Failed to update book. Please try again.');
  }
});

// Cancel edit modal
cancelEditBtn.addEventListener('click', closeEditModal);

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
  if (e.target === editModal) {
    closeEditModal();
  }
});

// Load all books from API
async function loadBooks() {
  try {
    const response = await fetch(API_BASE_URL);
    const books = await response.json();

    displayBooks(books);
    updateAverageRating(books);
  } catch (error) {
    console.error('Error loading books:', error);
    booksList.innerHTML = '<p class="text-red-500 text-center py-8">Failed to load books. Please refresh the page.</p>';
  }
}

// Display books in the UI
function displayBooks(books) {
  if (books.length === 0) {
    booksList.innerHTML = '<p id="emptyState" class="text-gray-500 text-center py-8">No books added yet. Start by adding your first book!</p>';
    return;
  }

  booksList.innerHTML = books
    .map(
      (book) => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50" data-book-id="${escapeHtml(book.id)}">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-gray-800">${escapeHtml(book.title)}</h3>
          <p class="text-gray-600 mt-1">by ${escapeHtml(book.author)}</p>
          ${book.rating ? `<div class="mt-2">${generateStarRating(book.rating)}</div>` : ''}
          ${book.note ? `<p class="text-gray-700 mt-2 text-sm">${escapeHtml(book.note)}</p>` : ''}
          <p class="text-gray-500 text-xs mt-2">
            Added: ${formatDate(book.createdAt)}
            ${book.updatedAt ? ` | Updated: ${formatDate(book.updatedAt)}` : ''}
          </p>
        </div>
        <div class="flex gap-2">
          <button
            data-action="edit"
            data-book-id="${escapeHtml(book.id)}"
            data-book-title="${escapeHtml(book.title)}"
            data-book-author="${escapeHtml(book.author)}"
            data-book-rating="${book.rating || ''}"
            data-book-note="${escapeHtml(book.note || '')}"
            class="edit-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
          >
            Edit
          </button>
          <button
            data-action="delete"
            data-book-id="${escapeHtml(book.id)}"
            class="delete-btn px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');
}

// Open edit modal with book data
function openEditModal(id, title, author, rating, note) {
  document.getElementById('editId').value = id;
  document.getElementById('editTitle').value = title;
  document.getElementById('editAuthor').value = author;
  document.getElementById('editRating').value = rating;
  document.getElementById('editNote').value = note;
  editModal.classList.remove('hidden');
}

// Close edit modal
function closeEditModal() {
  editModal.classList.add('hidden');
  editForm.reset();
}

// Delete a book
async function deleteBook(id) {
  if (!confirm('Are you sure you want to delete this book?')) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      loadBooks();
    } else {
      const error = await response.json();
      alert(`Error: ${error.error || 'Failed to delete book'}`);
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    alert('Failed to delete book. Please try again.');
  }
}

// Update average rating display
function updateAverageRating(books) {
  const ratedBooks = books.filter((book) => book.rating !== null && book.rating !== undefined);

  if (ratedBooks.length === 0) {
    avgRatingValue.textContent = 'No ratings yet';
    avgRatingStars.innerHTML = '';
    return;
  }

  const sum = ratedBooks.reduce((acc, book) => acc + book.rating, 0);
  const average = (sum / ratedBooks.length).toFixed(2);

  avgRatingValue.textContent = `${average} (${ratedBooks.length} ${ratedBooks.length === 1 ? 'book' : 'books'})`;
  avgRatingStars.innerHTML = generateStarRating(Math.round(average));
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  let starsHTML = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHTML += '<span class="star">⭐</span>';
    } else if (i === fullStars && hasHalfStar) {
      starsHTML += '<span class="star">⭐</span>';
    } else {
      starsHTML += '<span class="star-empty">☆</span>';
    }
  }

  return `<div class="rating-display">${starsHTML}</div>`;
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Attach event listeners to edit and delete buttons using event delegation
function attachEventListeners() {
  // Use event delegation for edit buttons
  booksList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn') || e.target.closest('.edit-btn')) {
      const btn = e.target.classList.contains('edit-btn') ? e.target : e.target.closest('.edit-btn');
      const id = btn.getAttribute('data-book-id');
      const title = btn.getAttribute('data-book-title');
      const author = btn.getAttribute('data-book-author');
      const rating = btn.getAttribute('data-book-rating');
      const note = btn.getAttribute('data-book-note');
      openEditModal(id, title, author, rating, note);
    }

    if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
      const btn = e.target.classList.contains('delete-btn') ? e.target : e.target.closest('.delete-btn');
      const id = btn.getAttribute('data-book-id');
      deleteBook(id);
    }
  });
}

