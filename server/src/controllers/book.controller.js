const bookService = require("../services/book.service");

const getAllBooks = async (req, res) => {
    const books = await bookService.getAllBooks();
    return res.json(books);
};

const getBookById = async (req, res) => {
    const id = parseInt(req.params.id);
    const book = await bookService.getBookById(id);
    if (!book) {
        return res.status(404).json({
            message: "Book Not Found"
        });
    }
    return res.json(book);
};

const createBook = async (req, res) => {
    const { title, price, stock } = req.body;
    const newBook = await bookService.createBook({
        title,
        price,
        stock
    });
    return res.status(201).json(newBook);
};

const updateBook = (req, res) => {
    const id = parseInt(req.params.id);
    const updatedBook = bookService.updateBook(id, req.body);
    if (!updatedBook) {
        return res.status(404).json({
            message: "Book Not Found"
        });
    }
    return res.json(updatedBook);
};

const deleteBook = (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = bookService.deleteBook(id);
    if (!deleted) {
        return res.status(404).json({
            message: "Book Not Found"
        });
    }
    return res.status(200).json({
        message: "Book Successfully Deleted"
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};