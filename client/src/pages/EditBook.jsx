import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { getBookById, updateBook } from "../services/book.services";
import "./BookForm.css";

const normalizeBook = (data) => data?.book || data?.data || data || {};

function EditBook() {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        stock: ""
    });
    const [existingCover, setExistingCover] = useState("");
    const [coverImage, setCoverImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const fetchBook = async () => {
            try {
                const data = await getBookById(id);
                const book = normalizeBook(data);
                if (isMounted) {
                    setFormData({
                        title: book.title || "",
                        price: book.price ?? "",
                        stock: book.stock ?? ""
                    });
                    setExistingCover(book.coverImage || book.coverUrl || book.image || book.imageUrl || "");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to load book");
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchBook();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const previewUrl = useMemo(() => {
        return coverImage ? URL.createObjectURL(coverImage) : existingCover;
    }, [coverImage, existingCover]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleFile = (file) => {
        if (!file) {
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file");
            return;
        }
        setCoverImage(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.title.trim() || !formData.price || !formData.stock) {
            toast.error("Title, price, and stock are required");
            return;
        }

        const payload = new FormData();
        payload.append("title", formData.title.trim());
        payload.append("price", formData.price);
        payload.append("stock", formData.stock);
        if (coverImage) {
            payload.append("coverImage", coverImage);
        }

        setIsSubmitting(true);
        try {
            await updateBook(id, payload);
            toast.success("Book updated successfully");
            navigate("/books");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update book");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="page-section fade-in">
                <div className="table-state">Loading book...</div>
            </section>
        );
    }

    return (
        <section className="page-section fade-in">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Inventory</p>
                    <h2>Edit Book</h2>
                </div>
            </div>

            <div className="panel book-form-card">
                <form className="book-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <label className="form-field full-width">
                            <span>Title</span>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} />
                        </label>

                        <label className="form-field">
                            <span>Price</span>
                            <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleChange} />
                        </label>

                        <label className="form-field">
                            <span>Stock</span>
                            <input type="number" min="0" name="stock" value={formData.stock} onChange={handleChange} />
                        </label>

                        <label
                            className={isDragging ? "upload-zone drag-active full-width" : "upload-zone full-width"}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setIsDragging(true);
                            }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                        >
                            <input type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
                            {previewUrl ? (
                                <img className="cover-preview" src={previewUrl} alt="Cover preview" />
                            ) : (
                                <div className="upload-content">
                                    <FiUploadCloud />
                                    <strong>Drop cover image here</strong>
                                    <span>or click to choose a file</span>
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="form-actions">
                        <Link className="btn btn-secondary" to="/books">Cancel</Link>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default EditBook;
