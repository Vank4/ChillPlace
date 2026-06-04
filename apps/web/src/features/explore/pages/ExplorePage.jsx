import {
  exploreCategories,
  exploreFilters,
  explorePlaces
} from "../../../data/mockExplore.js";
import { ExploreSearchBar } from "../components/ExploreSearchBar.jsx";
import { ExploreSidePanel } from "../components/ExploreSidePanel.jsx";
import { FilterChips } from "../components/FilterChips.jsx";
import { PlaceCard } from "../components/PlaceCard.jsx";
import "./ExplorePage.css";

export function ExplorePage() {
  return (
    <div className="explore-page">
      <section className="explore-page__main" aria-label="Khám phá địa điểm">
        <header className="explore-page__hero">
          <span className="explore-page__eyebrow">Explore/Search</span>
          <h1>Tìm đúng nơi cho đúng mood</h1>
          <p>
            Tìm địa điểm theo nhu cầu, khu vực, rating, giá và hashtag. Đây là bản
            giao diện đầu tiên, dùng mock data để chuẩn bị nối API places/search.
          </p>
        </header>

        <ExploreSearchBar />

        <FilterChips items={exploreCategories} variant="category" />
        <FilterChips items={exploreFilters} />

        <div className="explore-page__result-header">
          <div>
            <strong>Gợi ý phù hợp</strong>
            <span>{explorePlaces.length} địa điểm đang hiển thị</span>
          </div>
          <button type="button">Sắp xếp: Gần nhất</button>
        </div>

        <section className="explore-page__grid">
          {explorePlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </section>
      </section>

      <ExploreSidePanel />
    </div>
  );
}
