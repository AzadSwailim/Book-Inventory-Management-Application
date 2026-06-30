import api from "../api/axios";

export const getBooks = async () => {
    const response = await api.get("/books");
    return response.data;
};

export const getBookById = async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
};

export const createBook = async (bookData) => {
    const response = await api.post("/books", bookData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};

export const updateBook = async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
};

export const sellBook = async (book, quantitySold) => {
    const bookId = book.id || book._id;
    const updatedStock = Number(book.stock) - quantitySold;
    const bookData = new FormData();

    bookData.append("title", book.title);
    bookData.append("price", book.price);
    bookData.append("stock", updatedStock);

    return updateBook(bookId, bookData);
};

export const restockBook = async (book, quantity) => {
    const bookId = book.id || book._id;
    const response = await api.patch(`/books/${bookId}/restock`, { quantity });
    return response.data;
};

export const deleteBook = async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
};
