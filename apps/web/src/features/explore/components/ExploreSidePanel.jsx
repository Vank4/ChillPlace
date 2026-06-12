import { MapPin, Navigation, TrendingUp } from "lucide-react";
import { exploreStats } from "../../../data/mockExplore.js";

export function ExploreSidePanel({ resultCount, keyword, onOpenMap }) {
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
          <p>
            {resultCount} địa điểm phù hợp
            {keyword ? ` với từ khóa "${keyword}"` : " với bộ lọc hiện tại"}.
          </p>
        </div>
        <button type="button" onClick={onOpenMap}>
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
          <strong>Mock API đang chạy</strong>
          <p>Search, filter và bookmark đang dùng service giả lập kết hợp localStorage.</p>
        </div>
      </section>
    </aside>
  );
}
