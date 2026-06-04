import { SlidersHorizontal, Search } from "lucide-react";

export function ExploreSearchBar() {
  return (
    <form className="explore-search" role="search">
      <Search className="explore-search__icon" size={20} aria-hidden="true" />
      <label className="sr-only" htmlFor="explore-search-input">
        Tìm kiếm địa điểm
      </label>
      <input
        id="explore-search-input"
        type="search"
        defaultValue="cafe"
        placeholder="Tìm địa điểm, quán cafe, hashtag..."
      />
      <button type="button" aria-label="Mở bộ lọc">
        <SlidersHorizontal size={19} aria-hidden="true" />
      </button>
    </form>
  );
}
