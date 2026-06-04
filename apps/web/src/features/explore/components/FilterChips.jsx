export function FilterChips({ items, variant = "filter" }) {
  return (
    <div className={`filter-chips filter-chips--${variant}`} aria-label="Bộ lọc">
      {items.map((item) => (
        <button
          className={item.active ? "filter-chips__item is-active" : "filter-chips__item"}
          key={item.id}
          type="button"
        >
          {item.icon ? <item.icon size={18} aria-hidden="true" /> : null}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
