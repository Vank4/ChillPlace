import { CalendarDays, Eye, Gift, MessageSquareText, Star, Users } from "lucide-react";
import { useMemo } from "react";
import {
  BusinessActionLink,
  BusinessHeader,
  BusinessMetric,
  BusinessNav
} from "../components/BusinessCenterNav.jsx";
import { getBusinessState } from "../../../services/business.service.js";
import "./BusinessPages.css";

const chartData = [
  { label: "T2", value: 42 },
  { label: "T3", value: 58 },
  { label: "T4", value: 49 },
  { label: "T5", value: 76 },
  { label: "T6", value: 88 },
  { label: "T7", value: 96 },
  { label: "CN", value: 73 }
];

export function BusinessDashboardPage() {
  const state = useMemo(() => getBusinessState(), []);
  const views = state.places.reduce((total, place) => total + place.views, 0);
  const bookings = state.places.reduce((total, place) => total + place.bookings, 0);
  const pendingReviews = state.reviews.filter((review) => review.status === "pending").length;
  const activePromotions = state.promotions.filter((promotion) => promotion.status === "Đang chạy").length;

  return (
    <main className="business-page">
      <BusinessHeader
        eyebrow="Business Center"
        title={`Chào buổi sáng, ${state.profile.name}`}
        description="Theo dõi sức khỏe địa điểm, phản hồi khách hàng và hiệu quả khuyến mãi trong cùng một bảng điều khiển."
        action={<BusinessActionLink to="/business/promotions">Tạo khuyến mãi</BusinessActionLink>}
      />

      <BusinessNav />

      <section className="business-metrics-grid">
        <BusinessMetric icon={Eye} label="Lượt xem địa điểm" value={formatCompact(views)} detail="+18%" />
        <BusinessMetric icon={Users} label="Khách quan tâm" value={formatCompact(bookings)} tone="blue" />
        <BusinessMetric icon={Star} label="Điểm đánh giá" value={state.profile.rating} tone="orange" />
        <BusinessMetric icon={Gift} label="Khuyến mãi chạy" value={activePromotions} />
      </section>

      <section className="business-layout-grid">
        <article className="business-panel">
          <header>
            <div>
              <span>Hiệu suất tuần</span>
              <h2>Lượt tiếp cận theo ngày</h2>
              <p>Các ngày cuối tuần đang kéo nhiều lượt xem nhất, phù hợp để đẩy ưu đãi ngắn hạn.</p>
            </div>
            <CalendarDays size={18} />
          </header>
          <div className="business-chart" aria-label="Biểu đồ lượt xem trong tuần">
            {chartData.map((item) => (
              <span key={item.label}>
                <i style={{ height: `${item.value}%` }} />
                <small>{item.label}</small>
              </span>
            ))}
          </div>
        </article>

        <article className="business-panel">
          <header>
            <div>
              <span>Cần xử lý</span>
              <h2>Việc ưu tiên</h2>
            </div>
            <MessageSquareText size={18} />
          </header>
          <div className="business-list">
            <ActionRow value={pendingReviews} title="Đánh giá chưa trả lời" caption="Nên phản hồi trong 24h" />
            <ActionRow value="92%" title="Hồ sơ hoàn thiện" caption="Thêm video ngắn để tăng chuyển đổi" />
            <ActionRow value={activePromotions} title="Ưu đãi đang chạy" caption="Theo dõi lượt đổi mã mỗi ngày" />
          </div>
        </article>
      </section>

      <section className="business-panel" style={{ marginTop: 14 }}>
        <header>
          <div>
            <span>Đánh giá mới</span>
            <h2>Tín hiệu từ khách hàng</h2>
          </div>
        </header>
        <div className="business-list">
          {state.reviews.slice(0, 3).map((review) => (
            <article className="business-review-card" key={review.id}>
              <header>
                <img src={review.avatar} alt="" />
                <div>
                  <h3>{review.author}</h3>
                  <time dateTime={review.date}>{formatDate(review.date)}</time>
                </div>
                <span className={review.status === "pending" ? "business-review-status is-pending" : "business-review-status"}>
                  {review.status === "pending" ? "Cần phản hồi" : "Đã phản hồi"}
                </span>
              </header>
              <div className="business-review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
              <p>{review.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ActionRow({ value, title, caption }) {
  return (
    <article className="business-list-card" style={{ gridTemplateColumns: "auto minmax(0, 1fr)" }}>
      <aside style={{ minWidth: 54, textAlign: "left" }}>
        <strong>{value}</strong>
        <small>mục</small>
      </aside>
      <div>
        <h3>{title}</h3>
        <p>{caption}</p>
      </div>
    </article>
  );
}

function formatCompact(value) {
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
