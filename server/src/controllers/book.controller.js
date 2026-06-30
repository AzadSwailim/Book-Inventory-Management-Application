const bookService = require("../services/book.services");

const getAllBooks = async (req, res) => {
    const { search, sort = "id", order = "asc" } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const books = await bookService.getAllBooks(
        search,
        page,
        limit,
        sort,
        order
    );

    return res.json(books);
};

const getBookById = async (req, res) => {
    const id = parseInt(req.params.id);

    const book = await bookService.getBookById(id);

    if (!book) {
        return res.status(404).json({
            message: "Book Not Found",
        });
    }

    return res.json(book);
};

const createBook = async (req, res) => {
    const { title, price, stock } = req.body;

    const newBook = await bookService.createBook(
        {
            title,
            price,
            stock,
        },
        req.file
    );

    return res.status(201).json(newBook);
};

const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);

    const updatedData = {
        ...req.body,
    };

    const updatedBook = await bookService.updateBook(
        id,
        updatedData,
        req.file
    );

    if (!updatedBook) {
        return res.status(404).json({
            message: "Book Not Found",
        });
    }

    return res.json(updatedBook);
};

const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);

    const deletedBook = await bookService.deleteBook(id);

    if (!deletedBook) {
        return res.status(404).json({
            message: "Book Not Found",
        });
    }

    return res.status(200).json({
        message: "Book Successfully Deleted",
    });
};
const restockBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    const updatedBook = await bookService.restockBook(id, quantity);

    if (!updatedBook) {
        return res.status(404).json({
            message: "Book Not Found",
        });
    }

    return res.json(updatedBook);
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    restockBook
};