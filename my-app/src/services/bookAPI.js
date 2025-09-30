// API service for BookBarn frontend
const API_BASE_URL = 'http://localhost:3000/api';

class BookAPI {
  // Get all books
  static async getAllBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch books');
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  // Create a new book
  static async createBook(bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to create book');
      }
    } catch (error) {
      console.error('Error creating book:', error);
      throw error;
    }
  }

  // Update a book
  static async updateBook(bookId, bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update book');
      }
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  }

  // Delete a book
  static async deleteBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        return true;
      } else {
        throw new Error(result.message || 'Failed to delete book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  // Get a single book
  static async getBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch book');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }
}

export default BookAPI;