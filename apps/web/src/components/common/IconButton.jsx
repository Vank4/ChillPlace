export function IconButton({ label, icon: Icon, className = "", badge, ...props }) {
  return (
    <button className={`icon-button ${className}`} aria-label={label} title={label} {...props}>
      <Icon size={20} aria-hidden="true" />
      {badge ? <span className="icon-button__badge">{badge}</span> : null}
    </button>
  );
}
