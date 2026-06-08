const StatsCard = ({ label, value, accent, hint }) => (
  <article className="stat-card glass hover-lift">
    <span className={`stat-orb ${accent}`} />
    <p>{label}</p>
    <h3>{value}</h3>
    <small>{hint}</small>
  </article>
);

export default StatsCard;

