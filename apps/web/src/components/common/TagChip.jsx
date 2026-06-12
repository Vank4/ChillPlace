function getCleanTag(value) {
  return value?.toString().trim().replace(/^#/, "") ?? "";
}

export function TagChip({ children, variant = "default", prefix = "#", onClick }) {
  const cleanTag = getCleanTag(children);
  const className = `tag-chip tag-chip--${variant}`;

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={(event) => {
          event.stopPropagation();
          onClick(cleanTag);
        }}
      >
        {prefix}
        {cleanTag}
      </button>
    );
  }

  return (
    <span className={className}>
      {prefix}
      {cleanTag}
    </span>
  );
}
