import { useState } from "react";
import { toast } from "react-hot-toast";

function SellBookModal({ open, book, isSubmitting, onCancel, onSell }) {
    const [quantitySold, setQuantitySold] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    if (!open || !book) {
        return null;
    }

    const currentStock = Number(book.stock || 0);

    const handleCancel = () => {
        setQuantitySold("");
        setCustomerName("");
        setCustomerPhone("");
        onCancel();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const trimmedQuantity = quantitySold.trim();

        if (!trimmedQuantity) {
            toast.error("Enter quantity sold.");
            return;
        }

        if (!/^\d+$/.test(trimmedQuantity)) {
            toast.error("Quantity sold must be a whole number.");
            return;
        }

        const quantity = Number(trimmedQuantity);

        if (quantity <= 0) {
            toast.error("Quantity sold must be greater than zero.");
            return;
        }

        if (quantity > currentStock) {
            toast.error("Cannot sell more books than available in stock.");
            return;
        }

        const trimmedCustomerName = customerName.trim();
        const trimmedCustomerPhone = customerPhone.trim();

        if (!trimmedCustomerName) {
            toast.error("Enter customer name.");
            return;
        }

        if (!trimmedCustomerPhone) {
            toast.error("Enter customer phone number.");
            return;
        }

        await onSell({
            quantity,
            customerName: trimmedCustomerName,
            customerPhone: trimmedCustomerPhone
        });
        setQuantitySold("");
        setCustomerName("");
        setCustomerPhone("");
    };

    return (
        <div className="modal-backdrop" role="presentation">
            <form className="sell-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="sell-book-title">
                <div>
                    <p className="eyebrow">Record Sale</p>
                    <h2 id="sell-book-title">{book.title}</h2>
                </div>

                <div className="sell-stock-summary">
                    <span>Current Stock</span>
                    <strong>{currentStock}</strong>
                </div>

                <label className="sell-field">
                    <span>Quantity Sold</span>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantitySold}
                        onChange={(event) => setQuantitySold(event.target.value)}
                        autoFocus
                    />
                </label>

                <label className="sell-field">
                    <span>Customer Name</span>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(event) => setCustomerName(event.target.value)}
                        required
                    />
                </label>

                <label className="sell-field">
                    <span>Customer Phone Number</span>
                    <input
                        type="tel"
                        value={customerPhone}
                        onChange={(event) => setCustomerPhone(event.target.value)}
                        required
                    />
                </label>

                <div className="confirm-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? "Selling..." : "Sell Books"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SellBookModal;
