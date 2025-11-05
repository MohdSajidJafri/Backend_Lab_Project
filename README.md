# 📚 BookNotes

A minimal full-stack web application for tracking your reading log. Add, view, edit, and delete books with ratings and notes.

## Features

- ✅ Add books with title, author, rating (1-5), and notes
- ✅ View all books in a clean, responsive interface
- ✅ Edit existing books inline
- ✅ Delete books with confirmation
- ✅ Average rating calculation
- ✅ Creation and update timestamps
- ✅ Beautiful Tailwind CSS design

## Project Structure

```
Backend_Lab_Project/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   └── books.js          # API routes for books
│   ├── utils/
│   │   └── fileOperations.js # JSON file read/write utilities
│   ├── data/
│   │   └── books.json        # JSON data storage
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── index.html            # Main HTML file
│   └── app.js                # Frontend JavaScript logic
└── README.md                 # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install backend dependencies:**

```bash
cd backend
npm install
```

2. **Start the server:**

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

3. **Open the application:**

Open your browser and navigate to:
```
http://localhost:5000
```

The Express server serves both the API and the static frontend files.

## API Endpoints

### GET `/api/books`
Returns all books.

**Response:**
```json
[
  {
    "id": "1234567890",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "rating": 5,
    "note": "A classic American novel",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:20:00.000Z"
  }
]
```

### POST `/api/books`
Adds a new book.

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "rating": 4,
  "note": "Optional notes"
}
```

**Response:** Created book object with ID and timestamps.

### PUT `/api/books/:id`
Updates an existing book.

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "rating": 5,
  "note": "Updated notes"
}
```

**Response:** Updated book object.

### DELETE `/api/books/:id`
Deletes a book.

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

## Usage

1. **Add a Book:**
   - Fill in the title and author (required)
   - Optionally select a rating (1-5 stars)
   - Optionally add notes
   - Click "Add Book"

2. **Edit a Book:**
   - Click the "Edit" button on any book card
   - Modify the fields in the modal
   - Click "Save Changes"

3. **Delete a Book:**
   - Click the "Delete" button on any book card
   - Confirm the deletion

4. **View Average Rating:**
   - The average rating of all rated books is displayed at the top
   - Shows the average score and visual star rating

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - CORS middleware
  - File system for JSON storage

- **Frontend:**
  - HTML5
  - Tailwind CSS (via CDN)
  - Vanilla JavaScript
  - Fetch API for HTTP requests

## Data Storage

Books are stored in `backend/data/books.json` as a JSON array. The file is automatically created on first use.

## Development

### Running in Development Mode

Install `nodemon` for auto-reload (already included in devDependencies):

```bash
cd backend
npm run dev
```

### File Structure Details

- **backend/server.js**: Main Express server, configures middleware and routes
- **backend/routes/books.js**: Handles all CRUD operations for books
- **backend/utils/fileOperations.js**: Utility functions for reading/writing JSON file
- **frontend/index.html**: Main HTML structure with Tailwind CSS styling
- **frontend/app.js**: Client-side JavaScript for API interactions and UI updates

## License

ISC
