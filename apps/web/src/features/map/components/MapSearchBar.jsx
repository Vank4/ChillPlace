import { LocateFixed, Search, SlidersHorizontal } from "lucide-react";

export function MapSearchBar({
  value,
  onChange,
  onSubmit,
  onLocate,
  onFilterToggle,
  isFilterOpen
}) {
  return (
    <form className="map-search" role="search" onSubmit={onSubmit}>
      <Search size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="map-search-input">
        Tìm kiếm trên bản đồ
      </label>
      <input
        id="map-search-input"
        placeholder="Tìm địa điểm..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        aria-label="Mở bộ lọc bản đồ"
        aria-expanded={isFilterOpen}
        onClick={onFilterToggle}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
      </button>
      <button type="button" aria-label="Vị trí hiện tại" onClick={onLocate}>
        <LocateFixed size={18} aria-hidden="true" />
      </button>
    </form>
  );
}
