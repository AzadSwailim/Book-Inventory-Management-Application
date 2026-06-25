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

const updateBook = async (id, updatedData) =>{
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    });
    if (!book){
        return null
    };
    return await prisma.book.update({
        where: {
            id
        },
        data: updatedData
    });
};

const deleteBook = async (id) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    });
    if (!book){
        return null
    };
    return await prisma.book.delete({
        where:{
            id
        }
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};