import { Bookmark, MapPin, Navigation, Star } from "lucide-react";
import { TagChip } from "../../../components/common/TagChip.jsx";

export function PlaceCard({ place, isSaved, onOpenDetail, onOpenMap, onToggleSave }) {
  function handleCardClick() {
    onOpenDetail(place.id);
  }

  function handleCardKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpenDetail(place.id);
    }
  }

  return (
    <article
      className="place-card"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="place-card__media">
        <img src={place.imageUrl} alt={place.alt} loading="lazy" decoding="async" />
        <button
          type="button"
          aria-label={isSaved ? `Bỏ lưu ${place.name}` : `Lưu ${place.name}`}
          aria-pressed={isSaved}
          className={isSaved ? "place-card__save is-saved" : "place-card__save"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave(place.id);
          }}
        >
          <Bookmark size={18} aria-hidden="true" />
        </button>
        <span
          className={
            place.statusCode === "open"
              ? "place-card__status-dot is-open"
              : "place-card__status-dot"
          }
        >
          <span aria-hidden="true" />
          <strong>{place.status}</strong>
        </span>
      </div>

      <div className="place-card__body">
        <div className="place-card__topline">
          <span>{place.category}</span>
          <strong>
            <Star size={14} aria-hidden="true" />
            {place.rating}
          </strong>
        </div>

        <h2>{place.name}</h2>

        <p className="place-card__location">
          <MapPin size={15} aria-hidden="true" />
          {place.area} · {place.distance}
        </p>

        <div className="place-card__meta">
          <span>{place.priceRange}</span>
          <span>{place.reviewCount} reviews</span>
        </div>

        <div className="place-card__tags">
          {place.tags.slice(0, 3).map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <div className="place-card__actions">
          <button
            type="button"
            className="place-card__detail-action"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetail(place.id);
            }}
          >
            Chi tiết
          </button>
          <button
            type="button"
            className="place-card__direction-action"
            aria-label={`Chỉ đường tới ${place.name}`}
            onClick={(event) => {
              event.stopPropagation();
              onOpenMap(place.id);
            }}
          >
            <span className="place-card__direction-icon">
              <Navigation size={15} aria-hidden="true" />
            </span>
            <span className="place-card__direction-label">Chỉ đường</span>
          </button>
        </div>
      </div>
    </article>
  );
}
