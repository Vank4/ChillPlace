import { CalendarDays, Gift, Megaphone, Save, Search, TicketPercent, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { BusinessHeader, BusinessMetric, BusinessNav } from "../components/BusinessCenterNav.jsx";
import { getBusinessState, savePromotion } from "../../../services/business.service.js";
import "./BusinessPages.css";

const defaultPromotion = {
  title: "Happy Hour Thứ 6",
  description: "Giảm sâu cho nhóm bạn ghé quán sau giờ làm, áp dụng tại Chill Coffee Hub.",
  tag: "GIẢM 50%",
  type: "Giảm giá trực tiếp",
  startDate: "2026-06-20",
  endDate: "2026-06-30",
  budget: 2500000
};

export function BusinessPromotionsPage() {
  const initialState = useMemo(() => getBusinessState(), []);
  const [promotions, setPromotions] = useState(initialState.promotions);
  const [draft, setDraft] = useState(defaultPromotion);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [toast, setToast] = useState("");

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesQuery = normalizeText(`${promotion.title} ${promotion.tag} ${promotion.type}`).includes(normalizeText(query));
    const matchesStatus = status === "all" || promotion.status === status;
    return matchesQuery && matchesStatus;
  });

  const activeCount = promotions.filter((promotion) => promotion.status === "Đang chạy").length;
  const totalReach = promotions.reduce((sum, promotion) => sum + promotion.reach, 0);
  const totalRedemptions = promotions.reduce((sum, promotion) => sum + promotion.redemptions, 0);

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextPromotion = savePromotion(draft);
    setPromotions((current) => [nextPromotion, ...current]);
    setToast("Đã tạo khuyến mãi mới");
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="business-page">
      <BusinessHeader
        eyebrow="Promotion Management"
        title="Chiến dịch khuyến mãi"
        description="Tạo ưu đãi, theo dõi lượt tiếp cận và quản lý các chiến dịch đang chạy cho địa điểm."
      />

      <BusinessNav />

      <section className="business-metrics-grid">
        <BusinessMetric icon={Gift} label="Đang chạy" value={activeCount} />
        <BusinessMetric icon={Megaphone} label="Lượt tiếp cận" value={formatCompact(totalReach)} tone="blue" />
        <BusinessMetric icon={TicketPercent} label="Lượt đổi mã" value={formatCompact(totalRedemptions)} />
        <BusinessMetric icon={Zap} label="Tỷ lệ đổi" value={totalReach ? `${Math.round((totalRedemptions / totalReach) * 100)}%` : "0%"} tone="orange" />
      </section>

      <section className="business-layout-grid">
        <form className="business-form-panel" onSubmit={handleSubmit}>
          <header>
            <div>
              <span>Tạo ưu đãi</span>
              <h2>Thông tin chiến dịch</h2>
              <p>Form này lưu mock vào localStorage để mô phỏng luồng đăng ưu đãi thật.</p>
            </div>
          </header>

          <div className="business-form-grid">
            <label style={{ gridColumn: "1 / -1" }}>
              Tiêu đề sự kiện / khuyến mãi
              <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Mô tả
              <textarea rows={4} value={draft.description} onChange={(event) => updateDraft("description", event.target.value)} />
            </label>
            <label>
              Ngày bắt đầu
              <input type="date" value={draft.startDate} onChange={(event) => updateDraft("startDate", event.target.value)} />
            </label>
            <label>
              Ngày kết thúc
              <input type="date" value={draft.endDate} onChange={(event) => updateDraft("endDate", event.target.value)} />
            </label>
            <label>
              Loại ưu đãi
              <select value={draft.type} onChange={(event) => updateDraft("type", event.target.value)}>
                <option>Giảm giá trực tiếp</option>
                <option>Combo</option>
                <option>Tặng món</option>
                <option>Voucher</option>
              </select>
            </label>
            <label>
              Nhãn ưu đãi
              <input value={draft.tag} onChange={(event) => updateDraft("tag", event.target.value.toUpperCase())} />
            </label>
          </div>

          <div className="business-form-actions">
            <button type="button">Lưu nháp</button>
            <button type="submit">
              <Save size={15} />
              Đăng tin ngay
            </button>
          </div>
        </form>

        <aside className="business-promo-preview" aria-label="Xem trước khuyến mãi">
          <span>{draft.tag || "KHUYẾN MÃI"}</span>
          <h2>{draft.title || "Tiêu đề ưu đãi"}</h2>
          <p>{draft.description || "Mô tả ưu đãi sẽ hiển thị tại đây."}</p>
          <div className="business-badge-row">
            <span className="business-badge">
              <CalendarDays size={12} />
              {formatShortDate(draft.startDate)} - {formatShortDate(draft.endDate)}
            </span>
          </div>
        </aside>
      </section>

      <section className="business-toolbar" style={{ marginTop: 14 }}>
        <label>
          <Search size={16} />
          <input value={query} placeholder="Tìm khuyến mãi..." onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div>
          {["all", "Đang chạy", "Nháp"].map((item) => (
            <button className={status === item ? "is-active" : ""} key={item} type="button" onClick={() => setStatus(item)}>
              {item === "all" ? "Tất cả" : item}
            </button>
          ))}
        </div>
      </section>

      <section className="business-list">
        {filteredPromotions.map((promotion) => (
          <article className="business-list-card" key={promotion.id}>
            <div className="business-promo-preview" style={{ minHeight: 92, padding: 10 }}>
              <span>{promotion.tag}</span>
            </div>
            <div>
              <h3>{promotion.title}</h3>
              <p>{promotion.type} · {formatShortDate(promotion.startDate)} - {formatShortDate(promotion.endDate)}</p>
              <div className="business-badge-row">
                <span className={promotion.status === "Đang chạy" ? "business-badge" : "business-badge business-badge--orange"}>{promotion.status}</span>
                <span className="business-badge business-badge--orange">Ngân sách {formatCompact(promotion.budget)}</span>
              </div>
            </div>
            <aside>
              <strong>{formatCompact(promotion.reach)}</strong>
              <small>{formatCompact(promotion.redemptions)} lượt đổi</small>
            </aside>
          </article>
        ))}
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

function formatCompact(value = 0) {
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(value));
}

