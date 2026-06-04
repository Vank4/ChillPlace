import { Bookmark, MapPin, Star } from "lucide-react";
import { Button } from "../../../components/common/Button.jsx";
import { TagChip } from "../../../components/common/TagChip.jsx";

export function PlaceCard({ place }) {
  return (
    <article className="place-card">
      <div className="place-card__media">
        <img src={place.imageUrl} alt={place.alt} loading="lazy" decoding="async" />
        <button type="button" aria-label={`Lưu ${place.name}`} className="place-card__save">
          <Bookmark size={18} aria-hidden="true" />
        </button>
        <span className="place-card__status">{place.status}</span>
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
          <Button variant="ghost">Chi tiết</Button>
          <Button>Chỉ đường</Button>
        </div>
      </div>
    </article>
  );
}
