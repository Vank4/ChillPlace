export function MapFilterBar({ filters, selectedFilter, onSelect }) {
  return (
    <div className="map-filter-bar" aria-label="Bộ lọc bản đồ">
      {filters.map((filter) => {
        const isActive = filter.id === selectedFilter;

        return (
          <button
            type="button"
            key={filter.id}
            className={isActive ? "map-filter-bar__item is-active" : "map-filter-bar__item"}
            aria-pressed={isActive}
            onClick={() => onSelect(filter.id)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
