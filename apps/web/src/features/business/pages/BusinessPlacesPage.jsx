import { Camera, CheckCircle2, Clock3, Eye, MapPin, Save, Search, Star, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { BusinessHeader, BusinessMetric, BusinessNav } from "../components/BusinessCenterNav.jsx";
import { getBusinessState, updateBusinessProfile } from "../../../services/business.service.js";
import "./BusinessPages.css";

export function BusinessPlacesPage() {
  const initialState = useMemo(() => getBusinessState(), []);
  const [profile, setProfile] = useState(initialState.profile);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const filteredPlaces = initialState.places.filter((place) =>
    normalizeText(`${place.name} ${place.area} ${place.status}`).includes(normalizeText(query))
  );

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function handleSave(event) {
    event.preventDefault();
    updateBusinessProfile(profile);
    setToast("Đã lưu hồ sơ địa điểm");
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="business-page">
      <BusinessHeader
        eyebrow="Place Management"
        title="Quản lý hồ sơ địa điểm"
        description="Cập nhật thông tin hiển thị, thư viện ảnh, menu và tình trạng vận hành của các cơ sở."
      />

      <BusinessNav />

      <section className="business-metrics-grid business-metrics-grid--three">
        <BusinessMetric icon={Star} label="Rating trung bình" value={profile.rating} />
        <BusinessMetric icon={Eye} label="Tổng lượt xem" value={formatCompact(initialState.places.reduce((sum, place) => sum + place.views, 0))} tone="blue" />
        <BusinessMetric icon={CheckCircle2} label="Độ hoàn thiện" value="92%" />
      </section>

      <section className="business-toolbar">
        <label>
          <Search size={16} />
          <input value={query} placeholder="Tìm cơ sở, khu vực, trạng thái..." onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div>
          <button type="button" className="is-active">Tất cả</button>
          <button type="button">Đang mở</button>
          <button type="button">Cần cập nhật</button>
        </div>
      </section>

      <section className="business-layout-grid">
        <div className="business-list">
          <article className="business-hero-card">
            <img src={profile.heroImage} alt="" loading="eager" decoding="async" fetchPriority="high" />
            <div>
              <span className="business-badge">Hồ sơ công khai</span>
              <h2>{profile.name}</h2>
              <p>{profile.description}</p>
              <footer>
                <span>{profile.area}</span>
                <span>{profile.priceRange}</span>
                <span>{profile.status === "open" ? "Đang mở" : "Tạm đóng"}</span>
              </footer>
            </div>
          </article>

          <article className="business-panel">
            <header>
              <div>
                <span>Thư viện media</span>
                <h2>Ảnh nổi bật</h2>
              </div>
              <button className="business-inline-action" type="button">
                <Upload size={15} />
                Tải ảnh
              </button>
            </header>
            <div className="business-media-grid">
              {initialState.media.map((media) => (
                <div className="business-media-tile" key={media.id}>
                  <img src={media.image} alt={media.label} loading="lazy" decoding="async" />
                  <span>{media.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="business-panel">
            <header>
              <div>
                <span>Menu Management</span>
                <h2>Danh sách món</h2>
              </div>
              <button className="business-inline-action business-inline-action--primary" type="button">
                <Camera size={15} />
                Thêm món
              </button>
            </header>
            <div className="business-menu-table">
              {initialState.menu.map((item) => (
                <div className="business-menu-row" key={item.id}>
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                  <small>{formatMoney(item.price)}</small>
                  <span className="business-badge">{item.status}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <form className="business-form-panel" onSubmit={handleSave}>
          <header>
            <div>
              <span>Thông tin hiển thị</span>
              <h2>Chỉnh sửa nhanh</h2>
              <p>Những thông tin này sẽ xuất hiện ở trang địa điểm công khai.</p>
            </div>
          </header>

          <div className="business-form-grid">
            <label>
              Tên địa điểm
              <input value={profile.name} onChange={(event) => updateField("name", event.target.value)} />
            </label>
            <label>
              Danh mục
              <input value={profile.category} onChange={(event) => updateField("category", event.target.value)} />
            </label>
            <label>
              Khu vực
              <input value={profile.area} onChange={(event) => updateField("area", event.target.value)} />
            </label>
            <label>
              Số điện thoại
              <input value={profile.phone} onChange={(event) => updateField("phone", event.target.value)} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Địa chỉ
              <input value={profile.address} onChange={(event) => updateField("address", event.target.value)} />
            </label>
            <label style={{ gridColumn: "1 / -1" }}>
              Mô tả
              <textarea rows={4} value={profile.description} onChange={(event) => updateField("description", event.target.value)} />
            </label>
          </div>

          <div className="business-badge-row" style={{ marginTop: 12 }}>
            {profile.hours.map((hour) => (
              <span className="business-badge" key={hour.day}>
                <Clock3 size={12} />
                {hour.day}: {hour.value}
              </span>
            ))}
            <span className="business-badge business-badge--orange">
              <MapPin size={12} />
              {profile.amenities.length} tiện ích
            </span>
          </div>

          <div className="business-form-actions">
            <button type="button">Xem trước</button>
            <button type="submit">
              <Save size={15} />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </section>

      <section className="business-list" style={{ marginTop: 14 }}>
        {filteredPlaces.map((place) => (
          <article className="business-list-card" key={place.id}>
            <img src={place.image} alt="" loading="lazy" decoding="async" />
            <div>
              <h3>{place.name}</h3>
              <p>{place.area}</p>
              <div className="business-badge-row">
                <span className="business-badge">{place.status}</span>
                <span className="business-badge business-badge--orange">{place.completeness}% hoàn thiện</span>
              </div>
            </div>
            <aside>
              <strong>{place.rating}</strong>
              <small>{formatCompact(place.views)} lượt xem</small>
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

function formatCompact(value) {
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

