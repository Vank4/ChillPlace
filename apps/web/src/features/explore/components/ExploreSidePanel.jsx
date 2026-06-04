import { MapPin, Navigation, TrendingUp } from "lucide-react";
import { exploreStats } from "../../../data/mockExplore.js";

export function ExploreSidePanel() {
  return (
    <aside className="explore-side" aria-label="Tổng quan khám phá">
      <section className="explore-side__map">
        <div className="explore-side__map-grid" aria-hidden="true">
          <span className="explore-side__pin explore-side__pin--primary">
            <MapPin size={22} />
          </span>
          <span className="explore-side__pin explore-side__pin--secondary">
            <MapPin size={16} />
          </span>
          <span className="explore-side__pin explore-side__pin--accent">
            <MapPin size={18} />
          </span>
        </div>
        <div>
          <strong>Bản đồ khu vực</strong>
          <p>6 địa điểm phù hợp với bộ lọc cafe gần bạn.</p>
        </div>
        <button type="button">
          <Navigation size={16} aria-hidden="true" />
          Mở Map
        </button>
      </section>

      <section className="explore-side__stats">
        {exploreStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="explore-side__tip">
        <TrendingUp size={18} aria-hidden="true" />
        <div>
          <strong>Gợi ý demo</strong>
          <p>Trang này đang dùng mock data, sau này thay bằng `GET /api/places` với query filter.</p>
        </div>
      </section>
    </aside>
  );
}
