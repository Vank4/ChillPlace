import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  exploreCategories,
  exploreFilters
} from "../../../data/mockExplore.js";
import {
  getPlaces,
  getSavedPlaceIds,
  getSelectedFilters,
  saveRecentSearch,
  saveSelectedFilters,
  toggleSavedPlace
} from "../../../services/place.service.js";
import { ExploreSearchBar } from "../components/ExploreSearchBar.jsx";
import { ExploreSidePanel } from "../components/ExploreSidePanel.jsx";
import { FilterChips } from "../components/FilterChips.jsx";
import { PlaceCard } from "../components/PlaceCard.jsx";
import "./ExplorePage.css";

function toQueryParams(keyword, category, filters) {
  return {
    keyword,
    category,
    nearby: filters.includes("nearby"),
    openNow: filters.includes("open_now"),
    hasDeal: filters.includes("price"),
    minRating: filters.includes("rating") ? 4.5 : null,
    hasCreatorReview: filters.includes("creator")
  };
}

export function ExplorePage() {
  const navigate = useNavigate();
  const initialFilters = useMemo(() => getSelectedFilters(), []);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters.filters);
  const [places, setPlaces] = useState([]);
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => getSavedPlaceIds());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [forceError, setForceError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = toQueryParams(keyword, selectedCategory, selectedFilters);

    setIsLoading(true);
    setError("");
    saveSelectedFilters({
      keyword,
      category: selectedCategory,
      filters: selectedFilters
    });

    getPlaces({ ...params, forceError })
      .then((nextPlaces) => {
        if (!controller.signal.aborted) {
          setPlaces(nextPlaces);
          setForceError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPlaces([]);
        setError("Có lỗi xảy ra, vui lòng thử lại.");
          setForceError(false);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [keyword, selectedCategory, selectedFilters, forceError]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    saveRecentSearch(keyword);
    const cleanKeyword = keyword.trim();
    navigate(cleanKeyword ? `/search?q=${encodeURIComponent(cleanKeyword)}` : "/search");
  }

  function handleCategorySelect(categoryId) {
    setSelectedCategory(categoryId);
  }

  function handleFilterSelect(filterId) {
    setSelectedFilters((currentFilters) => {
      if (currentFilters.includes(filterId)) {
        return currentFilters.filter((item) => item !== filterId);
      }

      return [...currentFilters, filterId];
    });
  }

  function handleToggleSave(placeId) {
    setSavedPlaceIds(toggleSavedPlace(placeId));
  }

  function openPlaceDetail(placeId) {
    navigate(`/places/${placeId}`);
  }

  function openMap(placeId) {
    navigate(placeId ? `/map?place=${placeId}` : "/map");
  }

  return (
    <div className="explore-page">
      <section className="explore-page__main" aria-label="Khám phá địa điểm">
        <header className="explore-page__hero">
          <span className="explore-page__eyebrow">Explore/Search</span>
          <h1>Tìm đúng nơi cho đúng mood</h1>
          <p>
            Tìm địa điểm theo nhu cầu, khu vực, rating, giá và hashtag. Màn hình này đang
            chạy bằng mock API, state và localStorage như một app thật.
          </p>
        </header>

        <ExploreSearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSearchSubmit}
          onMockError={() => setForceError(true)}
        />

        <FilterChips
          items={exploreCategories}
          selectedIds={[selectedCategory]}
          variant="category"
          onSelect={handleCategorySelect}
        />
        <FilterChips
          items={exploreFilters}
          selectedIds={selectedFilters}
          onSelect={handleFilterSelect}
        />

        <div className="explore-page__result-header">
          <div>
            <strong>Gợi ý phù hợp</strong>
            <span>{isLoading ? "Đang tải dữ liệu..." : `${places.length} địa điểm đang hiển thị`}</span>
          </div>
          <button type="button" onClick={() => setSelectedFilters(["nearby"])}>
            Sắp xếp: Gần nhất
          </button>
        </div>

        {isLoading ? (
          <section className="explore-page__state" aria-live="polite">
            Đang tải dữ liệu...
          </section>
        ) : null}

        {!isLoading && error ? (
          <section className="explore-page__state explore-page__state--error" aria-live="polite">
            <strong>{error}</strong>
            <button type="button" onClick={() => setForceError(false)}>
              Thử lại
            </button>
          </section>
        ) : null}

        {!isLoading && !error && places.length === 0 ? (
          <section className="explore-page__state" aria-live="polite">
            Không tìm thấy địa điểm phù hợp.
          </section>
        ) : null}

        {!isLoading && !error && places.length > 0 ? (
          <section className="explore-page__grid">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSaved={savedPlaceIds.includes(place.id)}
                onOpenDetail={openPlaceDetail}
                onOpenMap={openMap}
                onToggleSave={handleToggleSave}
              />
            ))}
          </section>
        ) : null}
      </section>

      <ExploreSidePanel resultCount={places.length} keyword={keyword} onOpenMap={() => openMap()} />
    </div>
  );
}
