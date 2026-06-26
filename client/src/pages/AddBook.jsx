import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { createBook } from "../services/book.services";
import "./BookForm.css";

function AddBook() {
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        stock: ""
    });
    const [coverImage, setCoverImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const previewUrl = useMemo(() => {
        return coverImage ? URL.createObjectURL(coverImage) : "";
    }, [coverImage]);

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

        const title = formData.title.trim();
        const price = String(formData.price).trim();
        const stock = String(formData.stock).trim();
        const missingFields = [];

        if (!title) {
            missingFields.push("title");
        }
        if (!price) {
            missingFields.push("price");
        }
        if (!stock) {
            missingFields.push("stock");
        }
        if (!coverImage) {
            missingFields.push("cover image");
        }

        if (missingFields.length > 0) {
            toast.error(`Missing required field${missingFields.length > 1 ? "s" : ""}: ${missingFields.join(", ")}`);
            return;
        }

        const payload = new FormData();
        payload.append("title", title);
        payload.append("price", price);
        payload.append("stock", stock);
        payload.append("coverImage", coverImage);

        setIsSubmitting(true);
        try {
            await createBook(payload);
            toast.success("Book added successfully");
            navigate("/books");
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to add book");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page-section fade-in">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Inventory</p>
                    <h2>Add Book</h2>
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
                            <input name="coverImage" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
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
                            {isSubmitting ? "Saving..." : "Add Book"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

export default AddBook;
