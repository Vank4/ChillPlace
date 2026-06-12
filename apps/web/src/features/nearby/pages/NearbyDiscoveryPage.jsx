import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Coffee,
  Compass,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Star
} from "lucide-react";
import { getPlaces, getSavedPlaceIds, saveRecentSearch, toggleSavedPlace } from "../../../services/place.service.js";
import { mapPlaces } from "../../../data/mockMap.js";
import { PlaceCard } from "../../explore/components/PlaceCard.jsx";
import { MapCanvas } from "../../map/components/MapCanvas.jsx";
import "../../explore/pages/ExplorePage.css";
import "../../map/pages/MapPage.css";
import "./NearbyDiscoveryPage.css";

const nearbyCategories = [
  { id: "all", label: "Tất cả" },
  { id: "cafe", label: "Cafe" },
  { id: "food", label: "Ăn tối" },
  { id: "rooftop", label: "Rooftop" },
  { id: "study", label: "Workplace" },
  { id: "chill", label: "Chill out" }
];

const nearbyFilters = [
  { id: "open", label: "Đang mở" },
  { id: "rating", label: "4.5+ sao" },
  { id: "deal", label: "Có ưu đãi" }
];

const markerMetaById = new Map(mapPlaces.map((place) => [place.id, place]));

function withMarkerMeta(places) {
  return places.map((place, index) => ({
    ...place,
    ...(markerMetaById.get(place.id) ?? mapPlaces[index % mapPlaces.length])
  }));
}

function toServiceParams(keyword, activeCategory, activeFilters) {
  return {
    keyword,
    nearby: true,
    category: activeCategory === "all" ? "popular" : activeCategory,
    openNow: activeFilters.includes("open"),
    minRating: activeFilters.includes("rating") ? 4.5 : null,
    hasDeal: activeFilters.includes("deal")
  };
}

export function NearbyDiscoveryPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState(["open"]);
  const [places, setPlaces] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => getSavedPlaceIds());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getPlaces({
      ...toServiceParams(keyword, activeCategory, activeFilters),
      delayMs: 280
    })
      .then((nextPlaces) => {
        if (!isMounted) {
          return;
        }

        const sortedPlaces = withMarkerMeta(nextPlaces).sort((a, b) => a.distanceValue - b.distanceValue);
        setPlaces(sortedPlaces);
        setSelectedPlaceId((currentId) => {
          if (currentId && sortedPlaces.some((place) => place.id === currentId)) {
            return currentId;
          }

          return sortedPlaces[0]?.id ?? "";
        });
      })
      .catch(() => {
        if (isMounted) {
          setPlaces([]);
          setSelectedPlaceId("");
          setError("Có lỗi khi tải địa điểm gần bạn.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, activeFilters, keyword]);

  const selectedPlace = useMemo(
    () => places.find((place) => place.id === selectedPlaceId) ?? places[0] ?? null,
    [places, selectedPlaceId]
  );

  const suggestedPlaces = useMemo(() => places.filter((place) => place.id !== selectedPlace?.id).slice(0, 3), [
    places,
    selectedPlace
  ]);

  function handleSubmit(event) {
    event.preventDefault();
    saveRecentSearch(keyword);
  }

  function handleFilterToggle(filterId) {
    setActiveFilters((currentFilters) =>
      currentFilters.includes(filterId)
        ? currentFilters.filter((item) => item !== filterId)
        : [...currentFilters, filterId]
    );
  }

  function handleToggleSave(placeId) {
    setSavedPlaceIds(toggleSavedPlace(placeId));
  }

  function handleLocate() {
    setKeyword("");
    setActiveCategory("all");
    setActiveFilters(["open"]);
  }

  return (
    <div className="nearby-page">
      <section className="nearby-page__main" aria-label="Khám phá gần bạn">
        <header className="nearby-page__header">
          <div>
            <span className="nearby-page__eyebrow">Nearby discovery</span>
            <h1>Gần bạn</h1>
            <p>
              Gợi ý các không gian chill quanh vị trí hiện tại, sắp xếp theo khoảng cách và trạng thái
              đang mở.
            </p>
          </div>
          <div className="nearby-page__header-actions">
            <button type="button" aria-label="Định vị lại" onClick={handleLocate}>
              <LocateFixed size={18} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Thông báo">
              <Bell size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className="nearby-page__permission">
          <span>
            <LocateFixed size={20} aria-hidden="true" />
          </span>
          <div>
            <strong>Bật định vị để khám phá chính xác hơn</strong>
            <p>Hiện đang dùng mock location tại TP.HCM, có thể thay bằng geolocation API sau.</p>
          </div>
          <button type="button" onClick={handleLocate}>
            Cho phép
          </button>
        </section>

        <form className="nearby-page__search" role="search" onSubmit={handleSubmit}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={keyword}
            placeholder="Tìm địa điểm gần bạn..."
            aria-label="Tìm địa điểm gần bạn"
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <Search size={17} aria-hidden="true" />
          </button>
        </form>

        <div className="nearby-page__chips" aria-label="Danh mục gần bạn">
          {nearbyCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={activeCategory === category.id ? "is-active" : ""}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="nearby-page__filters" aria-label="Bộ lọc gần bạn">
          {nearbyFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={activeFilters.includes(filter.id) ? "is-active" : ""}
              onClick={() => handleFilterToggle(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="nearby-page__result-head">
          <div>
            <strong>{isLoading ? "Đang tìm quanh bạn..." : `${places.length} địa điểm gần bạn`}</strong>
            <span>{error || "Sắp xếp theo khoảng cách gần nhất."}</span>
          </div>
          <button type="button" onClick={() => navigate("/map")}>
            <MapIcon size={17} aria-hidden="true" />
            Mở bản đồ lớn
          </button>
        </div>

        {isLoading ? <div className="nearby-page__state">Đang tải địa điểm gần bạn...</div> : null}

        {!isLoading && error ? <div className="nearby-page__state nearby-page__state--error">{error}</div> : null}

        {!isLoading && !error && places.length === 0 ? (
          <div className="nearby-page__state">Không có địa điểm phù hợp quanh bạn.</div>
        ) : null}

        {!isLoading && !error && places.length > 0 ? (
          <section className="nearby-page__grid" aria-label="Danh sách địa điểm gần bạn">
            {places.map((place) => (
              <div
                key={place.id}
                className={place.id === selectedPlaceId ? "nearby-page__place is-selected" : "nearby-page__place"}
                onMouseEnter={() => setSelectedPlaceId(place.id)}
                onFocus={() => setSelectedPlaceId(place.id)}
              >
                <PlaceCard
                  place={place}
                  isSaved={savedPlaceIds.includes(place.id)}
                  onOpenDetail={(placeId) => navigate(`/places/${placeId}`)}
                  onOpenMap={(placeId) => navigate(`/map?place=${placeId}`)}
                  onToggleSave={handleToggleSave}
                />
              </div>
            ))}
          </section>
        ) : null}
      </section>

      <aside className="nearby-page__map-panel" aria-label="Bản đồ gần bạn">
        <div className="nearby-page__mini-map">
          <MapCanvas places={places} selectedPlaceId={selectedPlaceId} onSelectPlace={setSelectedPlaceId} />
          <button type="button" className="nearby-page__map-open" onClick={() => navigate("/map")}>
            <MapIcon size={17} aria-hidden="true" />
            Mở bản đồ lớn
          </button>
        </div>

        {selectedPlace ? (
          <article className="nearby-page__selected-card">
            <img src={selectedPlace.imageUrl} alt={selectedPlace.alt} loading="lazy" decoding="async" />
            <div>
              <span>{selectedPlace.category}</span>
              <strong>
                <Star size={14} aria-hidden="true" />
                {selectedPlace.rating}
              </strong>
            </div>
            <h2>{selectedPlace.name}</h2>
            <p>
              <MapPin size={15} aria-hidden="true" />
              {selectedPlace.area} · {selectedPlace.distance}
            </p>
            <div className="nearby-page__selected-actions">
              <button type="button" onClick={() => navigate(`/places/${selectedPlace.id}`)}>
                Chi tiết
              </button>
              <button type="button" onClick={() => navigate(`/map?place=${selectedPlace.id}`)}>
                <Navigation size={16} aria-hidden="true" />
                Chỉ đường
              </button>
            </div>
          </article>
        ) : null}

        <section className="nearby-page__suggestions">
          <div>
            <Coffee size={16} aria-hidden="true" />
            <strong>Gợi ý cho bạn</strong>
          </div>
          {suggestedPlaces.map((place) => (
            <button key={place.id} type="button" onClick={() => setSelectedPlaceId(place.id)}>
              <img src={place.imageUrl} alt="" loading="lazy" decoding="async" />
              <span>
                <strong>{place.name}</strong>
                <small>{place.distance} · {place.category}</small>
              </span>
              <Compass size={15} aria-hidden="true" />
            </button>
          ))}
        </section>

        <section className="nearby-page__insight">
          <Sparkles size={17} aria-hidden="true" />
          <div>
            <strong>Ưu tiên địa điểm đang mở</strong>
            <p>Mock service đang lọc theo trạng thái, rating, ưu đãi và khoảng cách.</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
