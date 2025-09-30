import React, { useState, useEffect } from "react";
import "./App.css";
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from "uuid";
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ParticlesBackground from './components/ParticlesBackground';
import Header from './components/Header';
import BookCard from './components/BookCard';
import AddBookModal from './components/AddBookModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ToastContainer from './components/ToastContainer';
import { useBookSearch } from './hooks/useBookSearch';
import { useToast } from './hooks/useToast';

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
  const [books, setBooks] = useState(sampleBooks);
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

  // Simple book management functions
  const addBook = (bookData) => {
    if (bookData) {
      const newBook = {
        ...bookData,
        status: bookData.status || 'want-to-read',
        dateAdded: new Date()
      };
      setBooks(prev => [...prev, newBook]);
      showSuccess('Book Added', `"${bookData.title}" has been added to your library!`);
    }
  };

  const deleteBook = (id) => {
    const book = books.find(b => b.id === id);
    if (book) {
      setBooks(prev => prev.filter(book => book.id !== id));
      showSuccess('Book Deleted', `"${book.title}" has been removed from your library.`);
    }
  };

  const readBook = (id) => {
    const book = books.find(b => b.id === id);
    if (book) {
      let newStatus = book.status;
      let message = '';
      
      if (book.status === 'want-to-read') {
        newStatus = 'currently-reading';
        message = `Started reading "${book.title}"! Happy reading! 📖`;
      } else if (book.status === 'currently-reading') {
        newStatus = 'read';
        message = `Congratulations! You finished "${book.title}"! 🎉`;
      } else {
        message = `Re-reading "${book.title}"? Great choice! 📚`;
      }
      
      setBooks(prev => prev.map(b => 
        b.id === id 
          ? { 
              ...b, 
              status: newStatus,
              dateStarted: newStatus === 'currently-reading' ? new Date() : b.dateStarted,
              dateRead: newStatus === 'read' ? new Date() : b.dateRead
            }
          : b
      ));
      
      showSuccess('Status Updated', message);
    }
  };
  
  return (
    <motion.div
      className="min-h-screen relative overflow-hidden theme-transition"
      style={{ backgroundColor: colors.background }}
    >
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
                      key={book.id}
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
