import React, { useState, useEffect } from "react";
import "./App.css";
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ParticlesBackground from './components/ParticlesBackground';
import Header from './components/Header';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import { useBookSearch } from './hooks/useBookSearch';
import { useToast } from './hooks/useToast';
import BookAPI from './services/bookAPI';

// Sample book data with more realistic information
const sampleBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    coverImage: 'https://covers.openlibrary.org/b/id/7222-M.jpg',
    description: 'A classic American novel set in the Jazz Age',
    status: 'read',
    dateAdded: new Date('2024-01-15'),
    dateRead: new Date('2024-02-20')
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    coverImage: 'https://covers.openlibrary.org/b/id/8225207-M.jpg',
    description: 'A gripping tale of racial injustice and childhood innocence',
    status: 'want-to-read',
    dateAdded: new Date('2024-02-10')
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian Fiction',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
    description: 'A dystopian social science fiction novel',
    status: 'currently-reading',
    dateAdded: new Date('2024-03-05'),
    dateStarted: new Date('2024-03-10')
  }
];

const AppContent = () => {
  const { colors } = useTheme();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, book: null });
  const [currentFilter, setCurrentFilter] = useState('all');
  
  const {
    searchQuery,
    filteredBooks,
    handleSearch,
    clearSearch
  } = useBookSearch(books);
  
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Load books from database on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      console.log('Attempting to load books from database...');
      const booksData = await BookAPI.getAllBooks();
      setBooks(booksData);
      console.log('✅ Books loaded from database:');
      console.log('📊 Total books found:', booksData.length);
      console.log('📚 Book details:', booksData);
      
      // Log each book individually for clarity
      booksData.forEach((book, index) => {
        console.log(`📖 Book ${index + 1}:`, {
          id: book._id || book.id,
          title: book.title,
          author: book.author,
          status: book.status,
          dateAdded: book.dateAdded
        });
      });
    } catch (error) {
      console.error('❌ Error loading books:', error);
      showError('Database Connection', 'Using offline mode - database connection failed');
      // Fall back to sample data if database fails
      setBooks(sampleBooks);
      console.log('🔄 Falling back to sample data');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  // Filter books based on status
  const getFilteredBooks = () => {
    let filtered = filteredBooks;
    
    if (currentFilter !== 'all') {
      filtered = filteredBooks.filter(book => book.status === currentFilter);
    }
    
    return filtered;
  };

  const displayedBooks = getFilteredBooks();

  // Get counts for each category
  const getCounts = () => {
    return {
      all: books.length,
      read: books.filter(book => book.status === 'read').length,
      'want-to-read': books.filter(book => book.status === 'want-to-read').length,
      'currently-reading': books.filter(book => book.status === 'currently-reading').length
    };
  };

  const counts = getCounts();

  // Book management functions with database integration
  const addBook = async (bookData) => {
    try {
      console.log('Adding book:', bookData);
      const newBook = await BookAPI.createBook({
        ...bookData,
        status: bookData.status || 'want-to-read',
        dateAdded: new Date()
      });
      
      console.log('Book added to database, refreshing data...');
      // Refresh the entire book list from database
      await loadBooks();
      
      showSuccess('Book Added', `"${bookData.title}" has been added to your library!`);
      console.log('Book added and data refreshed:', newBook);
    } catch (error) {
      console.error('Error adding book:', error);
      // Fallback to local storage
      const newBook = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        ...bookData,
        status: bookData.status || 'want-to-read',
        dateAdded: new Date()
      };
      setBooks(prev => [newBook, ...prev]);
      showSuccess('Book Added (Offline)', `"${bookData.title}" has been added locally!`);
    }
  };

  const deleteBook = async (id) => {
    const book = books.find(b => b._id === id || b.id === id);
    if (book) {
      setDeleteModal({ isOpen: true, book });
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.book) {
      try {
        await BookAPI.deleteBook(deleteModal.book._id || deleteModal.book.id);
        
        console.log('Book deleted from database, refreshing data...');
        // Refresh the entire book list from database
        await loadBooks();
        
        showSuccess('Book Deleted', `"${deleteModal.book.title}" has been removed from your library.`);
        console.log('Book deleted and data refreshed:', deleteModal.book._id || deleteModal.book.id);
      } catch (error) {
        console.error('Error deleting book:', error);
        // Fallback to local deletion
        setBooks(prev => prev.filter(book => 
          (book._id !== deleteModal.book._id) && (book.id !== deleteModal.book.id)
        ));
        showSuccess('Book Deleted (Offline)', `"${deleteModal.book.title}" has been removed locally.`);
      } finally {
        setDeleteModal({ isOpen: false, book: null });
      }
    }
  };

  const readBook = async (id) => {
    const book = books.find(b => b._id === id || b.id === id);
    if (book) {
      let newStatus = book.status;
      let message = '';
      let updateData = {};
      
      if (book.status === 'want-to-read') {
        newStatus = 'currently-reading';
        message = `Started reading "${book.title}"! Happy reading! 📖`;
        updateData = { 
          status: newStatus, 
          dateStarted: new Date() 
        };
      } else if (book.status === 'currently-reading') {
        newStatus = 'read';
        message = `Congratulations! You finished "${book.title}"! 🎉`;
        updateData = { 
          status: newStatus, 
          dateRead: new Date() 
        };
      } else {
        newStatus = 'currently-reading';
        message = `Re-reading "${book.title}"? Great choice! 📚`;
        updateData = { 
          status: newStatus, 
          dateStarted: new Date() 
        };
      }
      
      try {
        const updatedBook = await BookAPI.updateBook(book._id || book.id, updateData);
        
        console.log('Book status updated in database, refreshing data...');
        // Refresh the entire book list from database
        await loadBooks();
        
        showSuccess('Status Updated', message);
        console.log('Book status updated and data refreshed:', updatedBook);
      } catch (error) {
        console.error('Error updating book:', error);
        // Fallback to local update
        setBooks(prev => prev.map(b => 
          (b._id === id || b.id === id) 
            ? { 
                ...b, 
                status: newStatus,
                dateStarted: newStatus === 'currently-reading' ? new Date() : b.dateStarted,
                dateRead: newStatus === 'read' ? new Date() : b.dateRead
              }
            : b
        ));
        showSuccess('Status Updated (Offline)', message);
      }
    }
  };
  
  return (
    <motion.div
      className="min-h-screen relative overflow-hidden theme-transition"
      style={{ backgroundColor: colors.background }}
    >
      {/* Loading Screen */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {/* ParticlesBackground */}
      <ParticlesBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <Header 
          onAddBook={openModal}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          onFilterChange={handleFilterChange}
          currentFilter={currentFilter}
          onRefresh={loadBooks}
        />
        
        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          >
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 rounded-xl text-center cursor-pointer transition-all duration-300"
              style={{ 
                backgroundColor: colors.surface, 
                border: `1px solid ${currentFilter === 'all' ? colors.accent : colors.border}`,
                boxShadow: currentFilter === 'all' ? `0 0 20px ${colors.accent}30` : 'none'
              }}
              onClick={() => handleFilterChange('all')}
            >
              <h3 className="text-3xl font-bold mb-2" style={{ color: colors.accent }}>
                {counts.all}
              </h3>
              <p style={{ color: colors.textSecondary }}>Total Books</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 rounded-xl text-center cursor-pointer transition-all duration-300"
              style={{ 
                backgroundColor: colors.surface, 
                border: `1px solid ${currentFilter === 'read' ? colors.accentBlue : colors.border}`,
                boxShadow: currentFilter === 'read' ? `0 0 20px ${colors.accentBlue}30` : 'none'
              }}
              onClick={() => handleFilterChange('read')}
            >
              <h3 className="text-3xl font-bold mb-2" style={{ color: colors.accentBlue }}>
                {counts.read}
              </h3>
              <p style={{ color: colors.textSecondary }}>Books Read</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 rounded-xl text-center cursor-pointer transition-all duration-300"
              style={{ 
                backgroundColor: colors.surface, 
                border: `1px solid ${currentFilter === 'want-to-read' ? colors.accentPurple : colors.border}`,
                boxShadow: currentFilter === 'want-to-read' ? `0 0 20px ${colors.accentPurple}30` : 'none'
              }}
              onClick={() => handleFilterChange('want-to-read')}
            >
              <h3 className="text-3xl font-bold mb-2" style={{ color: colors.accentPurple }}>
                {counts['want-to-read']}
              </h3>
              <p style={{ color: colors.textSecondary }}>Want to Read</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.02, y: -4 }}
              className="p-6 rounded-xl text-center cursor-pointer transition-all duration-300"
              style={{ 
                backgroundColor: colors.surface, 
                border: `1px solid ${currentFilter === 'currently-reading' ? '#F59E0B' : colors.border}`,
                boxShadow: currentFilter === 'currently-reading' ? `0 0 20px #F59E0B30` : 'none'
              }}
              onClick={() => handleFilterChange('currently-reading')}
            >
              <h3 className="text-3xl font-bold mb-2" style={{ color: '#F59E0B' }}>
                {counts['currently-reading']}
              </h3>
              <p style={{ color: colors.textSecondary }}>Currently Reading</p>
            </motion.div>
          </motion.div>

          {/* Books Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Section Header */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
                {searchQuery 
                  ? `Search Results (${displayedBooks.length})` 
                  : `${currentFilter === 'all' ? 'Your Library' : 
                      currentFilter === 'read' ? 'Books Read' :
                      currentFilter === 'want-to-read' ? 'Want to Read' :
                      'Currently Reading'} (${displayedBooks.length})`
                }
              </h2>
              
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearSearch}
                  className="px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.surfaceLight,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  Clear Search
                </motion.button>
              )}
            </div>

            {/* Books Grid */}
            {displayedBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {displayedBooks.map((book) => (
                    <BookCard
                      key={book._id || book.id}
                      book={book}
                      onDelete={deleteBook}
                      onRead={readBook}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div 
                  className="text-6xl mb-4"
                  style={{ color: colors.textSecondary }}
                >
                  📚
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                  {searchQuery ? 'No books found' : 'Your library is empty'}
                </h3>
                <p className="mb-6" style={{ color: colors.textSecondary }}>
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Start building your digital library by adding your first book'
                  }
                </p>
                {!searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openModal}
                    className="px-6 py-3 rounded-xl text-white font-medium"
                    style={{ backgroundColor: colors.accent }}
                  >
                    Add Your First Book
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Modals and Notifications */}
      <div className="relative z-50">
        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAdd={addBook}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          book={deleteModal.book}
          onConfirm={confirmDelete}
          onClose={() => setDeleteModal({ isOpen: false, book: null })}
        />

        {/* Toast Notifications */}
        <ToastContainer
          toasts={toasts}
          onRemoveToast={removeToast}
        />
      </div>
    </motion.div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
