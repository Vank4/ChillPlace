export function MapMarker({ place, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`map-marker map-marker--${place.tone}${selected ? " is-selected" : ""}`}
      style={{ left: `${place.x}%`, top: `${place.y}%` }}
      aria-label={`Marker ${place.name}`}
      aria-pressed={selected}
      onClick={() => onSelect(place.id)}
    >
      <span className="map-marker__pulse" />
      <span className="map-marker__icon">
        <place.icon size={18} aria-hidden="true" />
      </span>
      <span className="map-marker__label">{place.name}</span>
    </button>
  );
}
