import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mapFilters, mapPlaces } from "../../../data/mockMap.js";
import { getPlaces, saveRecentSearch } from "../../../services/place.service.js";
import { MapCanvas } from "../components/MapCanvas.jsx";
import { MapFilterBar } from "../components/MapFilterBar.jsx";
import { MapPlacePreview } from "../components/MapPlacePreview.jsx";
import { MapSearchBar } from "../components/MapSearchBar.jsx";
import "./MapPage.css";

const markerMetaById = new Map(
  mapPlaces.map((place) => [place.id, {
    x: place.x,
    y: place.y,
    icon: place.icon,
    tone: place.tone
  }])
);

function toServiceParams(keyword, selectedFilter) {
  return {
    keyword,
    nearby: true,
    category: selectedFilter === "all" || selectedFilter === "open" ? "popular" : selectedFilter,
    openNow: selectedFilter === "open",
    hasDeal: selectedFilter === "deal"
  };
}

function withMarkerMeta(places) {
  return places.map((place, index) => ({
    ...place,
    ...(markerMetaById.get(place.id) ?? mapPlaces[index % mapPlaces.length])
  }));
}

export function MapPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlaceId = searchParams.get("place");
  const previewRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [places, setPlaces] = useState(() => withMarkerMeta(mapPlaces));
  const [selectedPlaceId, setSelectedPlaceId] = useState(initialPlaceId);
  const [isPreviewOpen, setIsPreviewOpen] = useState(Boolean(initialPlaceId));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextPlaceId = searchParams.get("place");

    setSelectedPlaceId(nextPlaceId);
    setIsPreviewOpen(Boolean(nextPlaceId));
  }, [searchParams]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!isPreviewOpen) {
        return;
      }

      const clickedInsidePreview = previewRef.current?.contains(event.target);
      const clickedMarker = event.target instanceof Element && event.target.closest(".map-marker");

      if (!clickedInsidePreview && !clickedMarker) {
        setIsPreviewOpen(false);
        setSelectedPlaceId(null);
        setSearchParams({});
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isPreviewOpen, setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getPlaces(toServiceParams(keyword, selectedFilter))
      .then((nextPlaces) => {
        if (!isMounted) {
          return;
        }

        const nextMapPlaces = withMarkerMeta(nextPlaces);
        setPlaces(nextMapPlaces);

        if (selectedPlaceId && !nextMapPlaces.some((place) => place.id === selectedPlaceId)) {
          setSelectedPlaceId(null);
          setIsPreviewOpen(false);
          setSearchParams({});
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Có lỗi xảy ra khi tải bản đồ. Vui lòng thử lại.");
          setPlaces([]);
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
  }, [keyword, selectedFilter, selectedPlaceId, setSearchParams]);

  const selectedPlace = useMemo(() => {
    if (!selectedPlaceId) {
      return null;
    }

    return places.find((place) => place.id === selectedPlaceId) ?? null;
  }, [places, selectedPlaceId]);

  const selectedFilterLabel = useMemo(
    () => mapFilters.find((filter) => filter.id === selectedFilter)?.label ?? "Tất cả",
    [selectedFilter]
  );

  function handleSearchSubmit(event) {
    event.preventDefault();
    saveRecentSearch(keyword);
  }

  function handleSelectPlace(placeId) {
    setSelectedPlaceId(placeId);
    setIsPreviewOpen(true);
    setSearchParams({ place: placeId });
  }

  function handleSelectFilter(filterId) {
    setSelectedFilter(filterId);
    setIsFilterOpen(false);
  }

  function handleLocate() {
    setKeyword("");
    setSelectedFilter("all");
    const firstPlaceId = mapPlaces[0]?.id;
    setSelectedPlaceId(firstPlaceId);
    setIsPreviewOpen(true);
    setSearchParams(firstPlaceId ? { place: firstPlaceId } : {});
  }

  return (
    <div className="map-page">
      <div className="map-page__canvas">
        <MapCanvas
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
        />
      </div>

      <div className="map-page__top">
        <MapSearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSearchSubmit}
          onLocate={handleLocate}
          onFilterToggle={() => setIsFilterOpen((current) => !current)}
          isFilterOpen={isFilterOpen}
        />
        <div className={isFilterOpen ? "map-page__filters is-open" : "map-page__filters"}>
          <button
            type="button"
            className="map-page__active-filter"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen((current) => !current)}
          >
            {selectedFilterLabel}
          </button>
          <MapFilterBar
            filters={mapFilters}
            selectedFilter={selectedFilter}
            onSelect={handleSelectFilter}
          />
        </div>
      </div>

      <div className="map-page__summary">
        <strong>{isLoading ? "Đang tải..." : `${places.length} địa điểm`}</strong>
        <span>
          {error || (keyword ? `Kết quả cho "${keyword}"` : "Đang hiển thị quanh vị trí hiện tại")}
        </span>
      </div>

      {isPreviewOpen && (
        <div className="map-page__preview is-open" ref={previewRef}>
          <MapPlacePreview
            place={selectedPlace}
            onOpenDetail={(placeId) => navigate(`/places/${placeId}`)}
            onDirections={(placeId) => navigate(`/map?place=${placeId}`)}
          />
        </div>
      )}
    </div>
  );
}
