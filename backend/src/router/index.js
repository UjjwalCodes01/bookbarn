const {Book} = require('../models/index');
const express = require('express');

const router = express.Router();

// Create a new book
router.post('/books', async (req, res) => {
    try {
        const body = req.body;
        const book = await Book.create({
            title: body.title,
            author: body.author,
            genre: body.genre || '',
            coverImage: body.coverImage || '',
            description: body.description || '',
            status: body.status || 'want-to-read',
            dateAdded: body.dateAdded || new Date(),
            dateStarted: body.dateStarted,
            dateRead: body.dateRead
        });

        res.status(201).json({
            success: true,
            data: book,
            message: 'Book created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating book',
            error: error.message
        });
    }
});

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({}).sort({dateAdded: -1});
        res.status(200).json({
            success: true,
            data: books,
            count: books.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: error.message
        });
    }
});

// Update a book
router.put('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book,
            message: 'Book updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating book',
            error: error.message
        });
    }
});

// Delete a book
router.delete('/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting book',
            error: error.message
        });
    }
});

// Get a single book
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching book',
            error: error.message
        });
    }
});

module.exports = router;