import { Search, SlidersHorizontal } from "lucide-react";

export function ExploreSearchBar({ value, onChange, onSubmit, onMockError }) {
  return (
    <form className="explore-search" role="search" onSubmit={onSubmit}>
      <Search className="explore-search__icon" size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="explore-search-input">
        Tìm kiếm địa điểm
      </label>
      <input
        id="explore-search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Tìm địa điểm, quán cafe, hashtag..."
      />
      <button className="explore-search__submit" type="submit" aria-label="Tìm kiếm">
        <Search size={18} aria-hidden="true" />
      </button>
      <button className="explore-search__filter" type="button" aria-label="Giả lập lỗi API" onClick={onMockError}>
        <SlidersHorizontal size={19} aria-hidden="true" />
      </button>
    </form>
  );
}
