const prisma = require ("../config/prisma");
const getAllBooks = async () => {
    return await prisma.book.findMany();
};

const getBookById = async (id) => {
    return await prisma.book.findUnique({
        where: {
            id
        }
    });
};

const createBook = async (bookData) => {
    return await prisma.book.create({
        data: bookData
    });
};

const updateBook = (id, updatedData) => {
    const book = books.find(book => book.id === id);
    if (!book) {
        return null;
    }
    Object.assign(book, updatedData);
    return book;
};

const deleteBook = (id) => {
    const index = books.findIndex(book => book.id === id);
    if (index === -1) {
        return false;
    }
    books.splice(index, 1);
    return true;
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};