const prisma = require ("../config/prisma");
const fs = require("fs/promises");

const getAllBooks = async (search, page, limit, sort, order) => {
    let where = {};
    if (search){
        where = {
            title: {
                contains: search,
            }
        }
    }
    return prisma.book.findMany({
        where,
        orderBy: {
            [sort]: order
        },
        skip: (page-1)*limit,
        take: limit
    });
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
    if (updatedData.coverImage) {
        if (book.coverImage) {
            try {
                await fs.unlink(book.coverImage);
            } catch (err) {
                console.log("Image not found:", err.message);
            }
        }
    }
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
    if (book.coverImage) {
        try {
            await fs.unlink(book.coverImage);
        } catch (err) {
            console.log("Image not found:", err.message);
        }
    }
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