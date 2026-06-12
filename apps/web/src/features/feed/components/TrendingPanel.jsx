import { ArrowRight, Flame, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TagChip } from "../../../components/common/TagChip.jsx";

export function TrendingPanel({ tags }) {
  const navigate = useNavigate();

  return (
    <aside className="feed-side-panel" aria-label="Gợi ý khám phá">
      <section className="feed-widget">
        <div className="feed-widget__title">
          <span className="feed-widget__icon">
            <Flame size={18} aria-hidden="true" />
          </span>
          <div>
            <strong>Đang nóng</strong>
            <span>Hashtag tăng nhanh hôm nay</span>
          </div>
        </div>
        <div className="feed-widget__tags">
          {tags.map((tag) => (
            <div className="feed-widget__tag-row" key={tag.id}>
              <TagChip
                variant="trending"
                onClick={(tagValue) => navigate(`/tags/${encodeURIComponent(tagValue)}`)}
              >
                {tag.label}
              </TagChip>
              <span>{tag.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="feed-widget feed-widget--map">
        <div className="feed-widget__map-art" aria-hidden="true">
          <span className="feed-widget__map-pin">
            <MapPin size={22} />
          </span>
        </div>
        <strong>Khám phá gần bạn</strong>
        <p>Mở bản đồ để xem cafe, rooftop và chỗ học bài đang được lưu nhiều quanh vị trí hiện tại.</p>
        <button type="button">
          Mở bản đồ
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </section>
    </aside>
  );
}
