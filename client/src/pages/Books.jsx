import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit2, FiImage, FiPackage, FiPlus, FiShoppingBag, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../components/ConfirmDialog";
import RestockBookModal from "../components/RestockBookModal";
import SellBookModal from "../components/SellBookModal";
import { deleteBook, getBooks, restockBook, sellBook } from "../services/book.services";
import "./Books.css";

const BOOKS_PER_PAGE = 5;
const API_BASE_URL = import.meta.env.VITE_API_URL;
const UPLOADS_BASE_URL = `${API_BASE_URL}/uploads`;

const normalizeBooks = (data) => {
    if (Array.isArray(data)) {
        return data;
    }
    if (Array.isArray(data?.books)) {
        return data.books;
    }
    if (Array.isArray(data?.data)) {
        return data.data;
    }
    return [];
};

const getCoverUrl = (book) => {
    const coverImage = book.coverImage || book.coverUrl || book.image || book.imageUrl || "";

    if (!coverImage) {
        return "";
    }

    if (/^https?:\/\//i.test(coverImage)) {
        return coverImage;
    }

    const normalizedPath = coverImage.replace(/^\/+/, "");

    if (normalizedPath.startsWith("uploads/")) {
        return `${API_BASE_URL}/${normalizedPath}`;
    }

    return `${UPLOADS_BASE_URL}/${normalizedPath}`;
};

function Books() {
    const { searchTerm = "" } = useOutletContext() || {};
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [priceFilter, setPriceFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [bookToSell, setBookToSell] = useState(null);
    const [bookToRestock, setBookToRestock] = useState(null);
    const [isSelling, setIsSelling] = useState(false);
    const [isRestocking, setIsRestocking] = useState(false);

    const refreshBooks = async () => {
        const data = await getBooks();
        setBooks(normalizeBooks(data));
    };

    useEffect(() => {
        let isMounted = true;

        const fetchBooks = async () => {
            try {
                const data = await getBooks();
                if (isMounted) {
                    setBooks(normalizeBooks(data));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to load books");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBooks();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredBooks = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        const price = (bookPrice) => {
            if (priceFilter === "under-500") {
                return bookPrice < 500;
            }
            if (priceFilter === "500-1000") {
                return bookPrice >= 500 && bookPrice <= 1000;
            }
            if (priceFilter === "over-1000") {
                return bookPrice > 1000;
            }
            return true;
        };

        const stock = (bookStock) => {
            if (stockFilter === "in-stock") {
                return bookStock > 0;
            }
            if (stockFilter === "low-stock") {
                return bookStock > 0 && bookStock <= 5;
            }
            if (stockFilter === "out-of-stock") {
                return bookStock === 0;
            }
            return true;
        };

        return books.filter((book) => {
            const title = String(book.title || "").toLowerCase();
            const bookPrice = Number(book.price || 0);
            const bookStock = Number(book.stock || 0);
            const matchesSearch = !search || title.includes(search);
            const matchesPrice = price(bookPrice);
            const matchesStock = stock(bookStock);
            return matchesSearch && matchesPrice && matchesStock;
        });
    }, [books, searchTerm, priceFilter, stockFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
    const activePage = Math.min(currentPage, totalPages);
    const visibleBooks = filteredBooks.slice((activePage - 1) * BOOKS_PER_PAGE, activePage * BOOKS_PER_PAGE);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const handleDelete = async () => {
        if (!bookToDelete) {
            return;
        }

        try {
            await deleteBook(bookToDelete.id || bookToDelete._id);
            setBooks((currentBooks) => currentBooks.filter((book) => (book.id || book._id) !== (bookToDelete.id || bookToDelete._id)));
            toast.success("Book deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to delete book");
        } finally {
            setBookToDelete(null);
        }
    };

    const handleSell = async (saleData) => {
        if (!bookToSell) {
            return;
        }

        setIsSelling(true);
        try {
            await sellBook(bookToSell, saleData);
            await refreshBooks();
            setBookToSell(null);
            toast.success("Sale recorded successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to record sale");
        } finally {
            setIsSelling(false);
        }
    };

    const handleRestock = async (quantity) => {
        if (!bookToRestock) {
            return false;
        }

        setIsRestocking(true);
        try {
            await restockBook(bookToRestock, quantity);
            await refreshBooks();
            setBookToRestock(null);
            toast.success("Book restocked successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to restock book");
            return false;
        } finally {
            setIsRestocking(false);
        }
    };

    return (
        <section className="page-section fade-in">
            <div className="section-heading books-heading">
                <div>
                    <p className="eyebrow">Inventory</p>
                    <h2>Books</h2>
                </div>
                <Link className="btn btn-primary" to="/books/add">
                    <FiPlus />
                    Add Book
                </Link>
            </div>

            <div className="filters-bar">
                <label>
                    <span>Price</span>
                    <select
                        value={priceFilter}
                        onChange={(event) => {
                            setPriceFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All prices</option>
                        <option value="under-500">Under 500</option>
                        <option value="500-1000">500 to 1000</option>
                        <option value="over-1000">Over 1000</option>
                    </select>
                </label>
                <label>
                    <span>Stock</span>
                    <select
                        value={stockFilter}
                        onChange={(event) => {
                            setStockFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All stock</option>
                        <option value="in-stock">In stock</option>
                        <option value="low-stock">Low stock</option>
                        <option value="out-of-stock">Out of stock</option>
                    </select>
                </label>
                {(priceFilter || stockFilter) && (
                    <button
                        type="button"
                        className="btn btn-secondary clear-filters"
                        onClick={() => {
                            setPriceFilter("");
                            setStockFilter("");
                            setCurrentPage(1);
                        }}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="table-card">
                <table className="books-table">
                    <thead>
                        <tr>
                            <th>Cover</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="table-state">Loading books...</td>
                            </tr>
                        ) : visibleBooks.length > 0 ? (
                            visibleBooks.map((book) => {
                                const bookId = book.id || book._id;
                                const coverUrl = getCoverUrl(book);

                                return (
                                    <tr key={bookId}>
                                        <td>
                                            <div className="cover-thumb">
                                                {coverUrl ? <img src={coverUrl} alt={book.title} /> : <FiImage />}
                                            </div>
                                        </td>
                                        <td className="book-title-cell">{book.title}</td>
                                        <td>{book.price}</td>
                                        <td>{book.stock}</td>
                                        <td>
                                            <div className="table-actions">
                                                <Link className="icon-button" to={`/books/edit/${bookId}`} aria-label={`Edit ${book.title}`}>
                                                    <FiEdit2 />
                                                </Link>
                                                <button
                                                    type="button"
                                                    className="icon-button sell-icon"
                                                    onClick={() => setBookToSell(book)}
                                                    aria-label={`Sell ${book.title}`}
                                                >
                                                    <FiShoppingBag />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="icon-button restock-icon"
                                                    onClick={() => setBookToRestock(book)}
                                                    aria-label={`Restock ${book.title}`}
                                                >
                                                    <FiPackage />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="icon-button danger-icon"
                                                    onClick={() => setBookToDelete(book)}
                                                    aria-label={`Delete ${book.title}`}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="table-state">No books match the current view.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button type="button" className="pagination-button" disabled={activePage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
                    Previous
                </button>
                <div className="pagination-pages">
                    {pageNumbers.map((page) => (
                        <button
                            type="button"
                            className={page === activePage ? "pagination-page active" : "pagination-page"}
                            key={page}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button type="button" className="pagination-button" disabled={activePage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
                    Next
                </button>
            </div>

            <ConfirmDialog
                open={Boolean(bookToDelete)}
                title="Delete this book?"
                message={`This will permanently remove "${bookToDelete?.title || "this book"}" from the inventory.`}
                confirmText="Delete"
                danger
                onCancel={() => setBookToDelete(null)}
                onConfirm={handleDelete}
            />

            <SellBookModal
                open={Boolean(bookToSell)}
                book={bookToSell}
                isSubmitting={isSelling}
                onCancel={() => setBookToSell(null)}
                onSell={handleSell}
            />

            <RestockBookModal
                open={Boolean(bookToRestock)}
                book={bookToRestock}
                isSubmitting={isRestocking}
                onCancel={() => setBookToRestock(null)}
                onRestock={handleRestock}
            />
        </section>
    );
}

export default Books;
