const ConfirmModal = ({ open, title, message, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal glass modal-sm">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="danger-button" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

