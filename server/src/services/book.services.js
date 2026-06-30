const prisma = require ("../config/prisma");
const supabase = require("../config/supabase");

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
    return await prisma.book.create({
        data: bookData,
    });
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
    return await prisma.book.delete({
        where: {
            id
        }
    });
};
const restockBook = async (id, quantity) => {
    const book = await prisma.book.findUnique({
        where: { id },
    });

    if (!book) {
        return null;
    }

    return prisma.book.update({
        where: { id },
        data: {
            stock: {
                increment: Number(quantity),
            },
        },
    });
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    restockBook
};