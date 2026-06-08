import { ArrowRight, Clock, MapPin, Navigation, Star } from "lucide-react";
import { Button } from "../../../components/common/Button.jsx";
import { TagChip } from "../../../components/common/TagChip.jsx";

export function MapPlacePreview({ place, onOpenDetail, onDirections }) {
  if (!place) {
    return (
      <article className="map-preview map-preview--empty">
        <div className="map-preview__content">
          <h2>Không có địa điểm phù hợp</h2>
          <p>Thử đổi từ khóa hoặc bộ lọc để xem thêm gợi ý quanh bạn.</p>
        </div>
      </article>
    );
  }

  return (
    <article className="map-preview">
      <div className="map-preview__handle" aria-hidden="true" />
      <img src={place.imageUrl} alt={place.alt} loading="lazy" decoding="async" />
      <div className="map-preview__content">
        <div className="map-preview__top">
          <span>{place.category}</span>
          <strong>
            <Star size={15} aria-hidden="true" />
            {place.rating}
          </strong>
        </div>
        <h2>{place.name}</h2>
        <p>
          <MapPin size={15} aria-hidden="true" />
          {place.area} · {place.distance}
        </p>
        <p>
          <Clock size={15} aria-hidden="true" />
          {place.status} · {place.priceRange}
        </p>
        <div className="map-preview__tags">
          {place.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
        <div className="map-preview__actions">
          <Button variant="ghost" onClick={() => onOpenDetail(place.id)}>
            Chi tiết
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <Button onClick={() => onDirections(place.id)}>
            <Navigation size={16} aria-hidden="true" />
            Chỉ đường
          </Button>
        </div>
      </div>
    </article>
  );
}
