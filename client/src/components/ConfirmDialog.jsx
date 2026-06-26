function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    danger = false,
    onConfirm,
    onCancel
}) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-backdrop" role="presentation">
            <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
                <h2 id="confirm-title">{title}</h2>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={danger ? "btn btn-danger" : "btn btn-primary"}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
