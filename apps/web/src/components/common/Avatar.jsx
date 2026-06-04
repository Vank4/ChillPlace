export function Avatar({ src, alt, size = "md" }) {
  return (
    <img
      className={`avatar avatar--${size}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}
