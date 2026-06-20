import { CheckCircle2, MessageSquareReply, Search, Send, Star, TimerReset } from "lucide-react";
import { useMemo, useState } from "react";
import { BusinessHeader, BusinessMetric, BusinessNav } from "../components/BusinessCenterNav.jsx";
import { getBusinessState, replyToReview } from "../../../services/business.service.js";
import "./BusinessPages.css";

export function BusinessReviewsPage() {
  const initialState = useMemo(() => getBusinessState(), []);
  const [reviews, setReviews] = useState(initialState.reviews);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [replies, setReplies] = useState({});
  const [toast, setToast] = useState("");

  const filteredReviews = reviews.filter((review) => {
    const matchesQuery = normalizeText(`${review.author} ${review.content} ${review.reply ?? ""}`).includes(normalizeText(query));
    const matchesStatus = status === "all" || review.status === status;
    return matchesQuery && matchesStatus;
  });

  const pendingCount = reviews.filter((review) => review.status === "pending").length;
  const repliedCount = reviews.filter((review) => review.status === "replied").length;
  const avgRating = Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10;
  const responseRate = Math.round((repliedCount / reviews.length) * 100);

  function handleReply(reviewId) {
    const content = replies[reviewId]?.trim();
    if (!content) return;

    const nextReviews = replyToReview(reviewId, content);
    setReviews(nextReviews);
    setReplies((current) => ({ ...current, [reviewId]: "" }));
    setToast("Đã gửi phản hồi cho khách hàng");
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="business-page">
      <BusinessHeader
        eyebrow="Business Reviews"
        title="Đánh giá khách hàng"
        description="Theo dõi cảm nhận mới, phản hồi nhanh và giữ tỉ lệ chăm sóc khách hàng ổn định."
      />

      <BusinessNav />

      <section className="business-metrics-grid">
        <BusinessMetric icon={Star} label="Rating trung bình" value={avgRating} />
        <BusinessMetric icon={TimerReset} label="Chưa trả lời" value={pendingCount} tone="orange" />
        <BusinessMetric icon={CheckCircle2} label="Tỉ lệ phản hồi" value={`${responseRate}%`} />
        <BusinessMetric icon={MessageSquareReply} label="Đã trả lời" value={repliedCount} tone="blue" />
      </section>

      <section className="business-toolbar">
        <label>
          <Search size={16} />
          <input value={query} placeholder="Tìm theo khách hàng, nội dung, phản hồi..." onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div>
          {[
            ["all", "Tất cả"],
            ["pending", "Chưa trả lời"],
            ["replied", "Đã trả lời"]
          ].map(([value, label]) => (
            <button className={status === value ? "is-active" : ""} key={value} type="button" onClick={() => setStatus(value)}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="business-panel">
        <header>
          <div>
            <span>Review inbox</span>
            <h2>{filteredReviews.length} đánh giá đang hiển thị</h2>
          </div>
        </header>

        <div className="business-list">
          {filteredReviews.map((review) => (
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

              {review.reply ? (
                <div className="business-reply-box">
                  <div className="business-reply-box__head">
                    <span>Phản hồi từ ChillPlace</span>
                  </div>
                  <p>{review.reply}</p>
                </div>
              ) : (
                <div className="business-reply-box">
                  <label className="business-reply-composer">
                    <span>Phản hồi của anh</span>
                    <textarea
                      value={replies[review.id] ?? ""}
                      placeholder="Cảm ơn khách hàng của anh..."
                      onChange={(event) => setReplies((current) => ({ ...current, [review.id]: event.target.value }))}
                    />
                  </label>
                  <div className="business-reply-box__actions">
                    <button className="business-inline-action business-inline-action--primary" type="button" onClick={() => handleReply(review.id)}>
                      <Send size={15} />
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {toast ? <div className="business-toast" role="status">{toast}</div> : null}
    </main>
  );
}

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
