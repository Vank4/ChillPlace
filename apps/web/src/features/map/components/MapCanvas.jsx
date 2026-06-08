import { MapMarker } from "./MapMarker.jsx";

export function MapCanvas({ places, selectedPlaceId, onSelectPlace }) {
  return (
    <section className="map-canvas" aria-label="Bản đồ địa điểm">
      <div className="map-canvas__grid" aria-hidden="true">
        <span className="map-canvas__road map-canvas__road--one" />
        <span className="map-canvas__road map-canvas__road--two" />
        <span className="map-canvas__road map-canvas__road--three" />
        <span className="map-canvas__park map-canvas__park--one" />
        <span className="map-canvas__park map-canvas__park--two" />
      </div>

      <div className="map-canvas__current" aria-label="Vị trí hiện tại">
        <span />
        <span />
        <strong />
      </div>

      {places.map((place) => (
        <MapMarker
          key={place.id}
          place={place}
          selected={place.id === selectedPlaceId}
          onSelect={onSelectPlace}
        />
      ))}
    </section>
  );
}
