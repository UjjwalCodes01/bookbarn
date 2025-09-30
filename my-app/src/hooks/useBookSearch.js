import { useState, useEffect, useMemo } from 'react';

export const useBookSearch = (books) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase();
    return books.filter(book => 
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.genre?.toLowerCase().includes(query) ||
      book.description?.toLowerCase().includes(query)
    );
  }, [books, searchQuery]);

  // Generate suggestions based on partial matches
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const titleSuggestions = books
      .map(book => book.title)
      .filter(title => title?.toLowerCase().includes(query))
      .slice(0, 3);

    const authorSuggestions = books
      .map(book => book.author)
      .filter(author => author?.toLowerCase().includes(query))
      .slice(0, 3);

    const allSuggestions = [
      ...new Set([...titleSuggestions, ...authorSuggestions])
    ].slice(0, 5);

    setSuggestions(allSuggestions);
    setShowSuggestions(allSuggestions.length > 0);
  }, [searchQuery, books]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  return {
    searchQuery,
    filteredBooks,
    suggestions,
    showSuggestions,
    handleSearch,
    clearSearch,
    selectSuggestion,
    setShowSuggestions
  };
};