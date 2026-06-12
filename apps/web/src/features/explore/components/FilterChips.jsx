export function FilterChips({ items, selectedIds = [], variant = "filter", onSelect }) {
  return (
    <div className={`filter-chips filter-chips--${variant}`} aria-label="Bộ lọc">
      {items.map((item) => {
        const isActive = selectedIds.includes(item.id);

        return (
          <button
            className={isActive ? "filter-chips__item is-active" : "filter-chips__item"}
            key={item.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(item.id)}
          >
            {item.icon ? <item.icon size={18} aria-hidden="true" /> : null}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
