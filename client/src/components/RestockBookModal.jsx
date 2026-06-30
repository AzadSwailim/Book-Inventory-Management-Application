import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

function RestockBookModal({ open, book, isSubmitting, onCancel, onRestock }) {
    const [quantityToAdd, setQuantityToAdd] = useState("");

    const validationMessage = useMemo(() => {
        const trimmedQuantity = quantityToAdd.trim();

        if (!trimmedQuantity) {
            return "Enter quantity to add.";
        }

        if (!/^\d+$/.test(trimmedQuantity)) {
            return "Quantity to add must be a whole number.";
        }

        if (Number(trimmedQuantity) <= 0) {
            return "Quantity to add must be greater than zero.";
        }

        return "";
    }, [quantityToAdd]);

    if (!open || !book) {
        return null;
    }

    const currentStock = Number(book.stock || 0);
    const canSubmit = !validationMessage && !isSubmitting;

    const handleCancel = () => {
        setQuantityToAdd("");
        onCancel();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validationMessage) {
            toast.error(validationMessage);
            return;
        }

        const wasSuccessful = await onRestock(Number(quantityToAdd.trim()));

        if (wasSuccessful) {
            setQuantityToAdd("");
        }
    };

    return (
        <div className="modal-backdrop" role="presentation">
            <form className="sell-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="restock-book-title">
                <div>
                    <p className="eyebrow">Restock Inventory</p>
                    <h2 id="restock-book-title">{book.title}</h2>
                </div>

                <div className="sell-stock-summary">
                    <span>Current Stock</span>
                    <strong>{currentStock}</strong>
                </div>

                <label className="sell-field">
                    <span>Quantity to Add</span>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantityToAdd}
                        onChange={(event) => setQuantityToAdd(event.target.value)}
                        autoFocus
                    />
                </label>

                <div className="confirm-actions">
                    <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                        {isSubmitting ? "Restocking..." : "Restock Book"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RestockBookModal;
