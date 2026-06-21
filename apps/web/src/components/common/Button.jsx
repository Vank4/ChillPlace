export function Button({ children, className = "", variant = "primary", ...props }) {
  return (
    <button type="button" className={`button button--${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}
