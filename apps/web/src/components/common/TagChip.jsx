export function TagChip({ children, variant = "default", prefix = "#" }) {
  return (
    <span className={`tag-chip tag-chip--${variant}`}>
      {prefix}
      {children}
    </span>
  );
}
