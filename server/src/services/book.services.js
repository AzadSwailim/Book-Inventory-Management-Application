const prisma = require ("../config/prisma");
const supabase = require("../config/supabase");
const { logActivity } = require("./activity.service");

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

const createBook = async (bookData, file) => {
    if (file) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { error } = await supabase.storage
            .from("book-covers")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });
        if (error) {
            throw new Error(error.message);
        }
        const {
            data: { publicUrl },
        } = supabase.storage
            .from("book-covers")
            .getPublicUrl(fileName);
        bookData.coverImage = publicUrl;
    }
    const newBook = await prisma.book.create({
        data: bookData,
    });
    await logActivity({
        action: "BOOK_CREATED",
        bookTitle: newBook.title,
        quantity: newBook.stock,
        newStock: newBook.stock,
        details: "Book created"
    });
    return newBook;
};

const updateBook = async (id, updatedData, file) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    });
    if (!book) {
        return null;
    }
    if (file) {
        if (book.coverImage) {
            const oldFileName = book.coverImage.split("/").pop();
            const { error: deleteError } = await supabase.storage
                .from("book-covers")
                .remove([oldFileName]);
            if (deleteError) {
                console.log("Failed to delete old image:", deleteError.message);
            }
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        const { error } = await supabase.storage
            .from("book-covers")
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
            });
        if (error) {
            throw new Error(error.message);
        }
        const {
            data: { publicUrl },
        } = supabase.storage
            .from("book-covers")
            .getPublicUrl(fileName);
        updatedData.coverImage = publicUrl;
    }
    const updatedBook = await prisma.book.update({
        where: {
            id
        },
        data: updatedData
    });
    await logActivity({
        action: "BOOK_UPDATED",
        bookTitle: updatedBook.title,
        details: "Book information updated"
    });
    return updatedBook;
};

const deleteBook = async (id) => {
    const book = await prisma.book.findUnique({
        where: {
            id
        }
    });
    if (!book) {
        return null;
    }
    if (book.coverImage) {
        const fileName = book.coverImage.split("/").pop();
        const { error } = await supabase.storage
            .from("book-covers")
            .remove([fileName]);
        if (error) {
            console.log("Failed to delete image:", error.message);
        }
    }
    const deletedBook = await prisma.book.delete({
        where: {
            id
        }
    });
    await logActivity({
        action: "BOOK_DELETED",
        bookTitle: deletedBook.title,
        details: "Book deleted"
    });
    return deletedBook;
};

const sellBook = async (id, quantity) => {
    const book = await prisma.book.findUnique({
        where: { id },
    });
    if (!book) {
        return null;
    }
    const quantitySold = Number(quantity);
    if (!Number.isInteger(quantitySold) || quantitySold <= 0) {
        throw new Error("Quantity sold must be a positive whole number");
    }
    if (quantitySold > book.stock) {
        throw new Error("Cannot sell more books than available in stock");
    }
    const previousStock = book.stock;
    return await prisma.$transaction(async (tx) => {
        const updatedBook = await tx.book.update({
            where: { id },
            data: {
                stock: {
                    decrement: quantitySold,
                },
            },
        });
        await logActivity({
            action: "BOOK_SOLD",
            bookTitle: updatedBook.title,
            quantity: quantitySold,
            previousStock,
            newStock: updatedBook.stock
        }, tx);
        return updatedBook;
    });
};

const restockBook = async (id, quantity) => {
    const book = await prisma.book.findUnique({
        where: { id },
    });
    if (!book) {
        return null;
    }
    const quantityAdded = Number(quantity);
    if (!Number.isInteger(quantityAdded) || quantityAdded <= 0) {
        throw new Error("Quantity added must be a positive whole number");
    }
    const previousStock = book.stock;
    return await prisma.$transaction(async (tx) => {
        const updatedBook = await tx.book.update({
            where: { id },
            data: {
                stock: {
                    increment: quantityAdded,
                },
            },
        });
        await logActivity({
            action: "BOOK_RESTOCKED",
            bookTitle: updatedBook.title,
            quantity: quantityAdded,
            previousStock,
            newStock: updatedBook.stock
        }, tx);
        return updatedBook;
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    sellBook,
    restockBook
};
