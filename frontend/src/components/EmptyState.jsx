const EmptyState = ({ title, text, actionLabel, onAction }) => (
  <div className="empty-state glass">
    <div className="empty-art">
      <span />
      <span />
      <span />
    </div>
    <h3>{title}</h3>
    <p>{text}</p>
    {actionLabel ? (
      <button className="primary-button" onClick={onAction}>
        {actionLabel}
      </button>
    ) : null}
  </div>
);

export default EmptyState;

