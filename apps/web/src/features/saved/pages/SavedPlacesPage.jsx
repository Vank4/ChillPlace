import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  ChevronRight,
  Compass,
  FileText,
  Heart,
  MapPin,
  Search,
  Sparkles,
  Star,
  Trash2
} from "lucide-react";
import { getPlaces, getSavedPlaceIds, toggleSavedPlace } from "../../../services/place.service.js";
import { PlaceCard } from "../../explore/components/PlaceCard.jsx";
import "../../explore/pages/ExplorePage.css";
import "./SavedPlacesPage.css";

const savedPosts = [
  {
    id: "sp1",
    detailPath: "/posts/post-1",
    title: "5 quán cafe có view sống ảo đẹp nhất Đà Lạt mùa này",
    author: "Linh ChillVibes",
    meta: "Đã lưu 2 ngày trước",
    stats: "1.2k lượt thích · 48 bình luận",
    tag: "Creator review",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCK4TFaqliWt5q6W350AtvTv9G2rcRvFNN9itQxyc1gN-AfE_U79sWmo2ZoZd48Q9KFcXVRkN3JPN9ExOMVL9T7YmhbSn3_-yaF0nbsOKsAUQZJvPopHGWS2c3VHOpVMOKnBb4iFphAC8t6ayLUkGL9Zqh6eHa_VZSydZw--DbB-btaOLnZbWLPUbZcGjASgzGBlY9AR_C1ouzCiAJP9rnWmXxIdtUqsVUxSSPeT0B_ICku3FRgG7709xF2PIBiZyL23QYdbxDZWUc"
  },
  {
    id: "sp2",
    detailPath: "/posts/post-3",
    title: "Hẻm nhỏ Sài Gòn: những bí mật chưa kể sau ánh đèn",
    author: "Minh Nguyen",
    meta: "Đã lưu tuần trước",
    stats: "856 lượt thích · 12 bình luận",
    tag: "Địa điểm đêm",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB-Nd54fBr1a2eaWnwNv_NLY4lknyNf8rHeTsN8WPLpUA51KkH9jmMh4yiOrnDVj2NAYa04hZ6Gwm8hgvrsUlaCjZU8VpkjwcP92GE-Fb26cZtd45uMioR-AY08FbYhnPOVGcKPXJVfZn2mrWYrugKwevvuC0rnZO2vMZB0Kn884WsS7PDMgu2li5YM9Kjmd9Tjlt3NxEOHqXGhdkFf6NASyE2XmWq05a3Jno-Dp-6lfaNYeme6xQYaOpuUIOAiuuhyVs1WFHIzD74"
  }
];

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

export function SavedPlacesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("places");
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState([]);
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => getSavedPlaceIds());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPlaces({ savedOnly: true, delayMs: 180 }).then((nextPlaces) => {
      if (!isMounted) return;
      setPlaces(nextPlaces);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [savedPlaceIds]);

  const filteredPlaces = useMemo(() => {
    const cleanKeyword = normalizeText(keyword);

    if (!cleanKeyword) return places;

    return places.filter((place) => {
      return normalizeText([place.name, place.category, place.area, ...place.tags].join(" ")).includes(cleanKeyword);
    });
  }, [keyword, places]);

  const filteredPosts = useMemo(() => {
    const cleanKeyword = normalizeText(keyword);

    if (!cleanKeyword) return savedPosts;

    return savedPosts.filter((post) => {
      return normalizeText([post.title, post.author, post.tag].join(" ")).includes(cleanKeyword);
    });
  }, [keyword]);

  const openPlaces = places.filter((place) => place.statusCode === "open").length;
  const averageRating = places.length
    ? (places.reduce((total, place) => total + place.rating, 0) / places.length).toFixed(1)
    : "0.0";

  function handleToggleSave(placeId) {
    setSavedPlaceIds(toggleSavedPlace(placeId));
  }

  return (
    <main className="saved-page">
      <section className="saved-page__hero" aria-label="Không gian đã lưu">
        <div>
          <span className="saved-page__eyebrow">Saved Space</span>
          <h1>Không gian của anh</h1>
          <p>Lưu giữ những địa điểm chill và bài viết đáng xem để quay lại nhanh khi cần lên lịch đi chơi.</p>
        </div>

        <div className="saved-page__quick-stats" aria-label="Thống kê đã lưu">
          <div>
            <Bookmark size={17} />
            <strong>{places.length}</strong>
            <span>Địa điểm</span>
          </div>
          <div>
            <Compass size={17} />
            <strong>{openPlaces}</strong>
            <span>Đang mở</span>
          </div>
          <div>
            <Star size={17} />
            <strong>{averageRating}</strong>
            <span>Rating TB</span>
          </div>
        </div>
      </section>

      <section className="saved-page__toolbar" aria-label="Tìm kiếm và phân loại đã lưu">
        <label className="saved-page__search">
          <Search size={18} aria-hidden="true" />
          <input
            value={keyword}
            placeholder="Tìm trong danh sách đã lưu..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>

        <div className="saved-page__tabs" role="tablist" aria-label="Loại nội dung đã lưu">
          <button
            className={activeTab === "places" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "places"}
            onClick={() => setActiveTab("places")}
          >
            <MapPin size={16} />
            Địa điểm
            <span>{places.length}</span>
          </button>
          <button
            className={activeTab === "posts" ? "is-active" : ""}
            type="button"
            role="tab"
            aria-selected={activeTab === "posts"}
            onClick={() => setActiveTab("posts")}
          >
            <FileText size={16} />
            Bài viết
            <span>{savedPosts.length}</span>
          </button>
        </div>
      </section>

      {activeTab === "places" ? (
        <section className="saved-page__content" aria-label="Địa điểm đã lưu">
          <div className="saved-page__section-heading">
            <div>
              <h2>Địa điểm đã lưu</h2>
              <span>{filteredPlaces.length} địa điểm đang hiển thị</span>
            </div>
            <button type="button" onClick={() => navigate("/explore")}>
              <Sparkles size={16} />
              Khám phá thêm
            </button>
          </div>

          {isLoading ? <div className="saved-page__state">Đang tải danh sách đã lưu...</div> : null}

          {!isLoading && filteredPlaces.length === 0 ? (
            <EmptyState
              title={keyword ? "Không tìm thấy địa điểm đã lưu" : "Anh chưa lưu địa điểm nào"}
              description={
                keyword
                  ? "Thử đổi từ khóa hoặc chuyển sang tab bài viết để tìm nội dung khác."
                  : "Bấm bookmark ở Explore, Map hoặc Place Detail để gom các địa điểm muốn quay lại vào đây."
              }
              actionLabel="Mở Explore"
              onAction={() => navigate("/explore")}
            />
          ) : null}

          {!isLoading && filteredPlaces.length > 0 ? (
            <div className="saved-page__grid">
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSaved={savedPlaceIds.includes(place.id)}
                  onOpenDetail={(placeId) => navigate(`/places/${placeId}`)}
                  onOpenMap={(placeId) => navigate(`/map?place=${placeId}`)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="saved-page__content" aria-label="Bài viết đã lưu">
          <div className="saved-page__section-heading">
            <div>
              <h2>Bài viết đã lưu</h2>
              <span>{filteredPosts.length} bài viết đang hiển thị</span>
            </div>
            <button type="button" onClick={() => navigate("/")}>
              <Sparkles size={16} />
              Về Home Feed
            </button>
          </div>

          {filteredPosts.length === 0 ? (
            <EmptyState
              title="Không tìm thấy bài viết đã lưu"
              description="Khi phần Post Detail hoàn thiện, các bài viết đã lưu sẽ được đồng bộ từ localStorage hoặc API."
              actionLabel="Về Home"
              onAction={() => navigate("/")}
            />
          ) : (
            <div className="saved-page__post-list">
              {filteredPosts.map((post) => (
                <article
                  className="saved-post"
                  key={post.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(post.detailPath)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(post.detailPath);
                    }
                  }}
                >
                  <img src={post.imageUrl} alt="" loading="lazy" decoding="async" />
                  <div>
                    <span>{post.tag}</span>
                    <h3>{post.title}</h3>
                    <p>
                      {post.author} · {post.meta}
                    </p>
                    <small>{post.stats}</small>
                    <button
                      className="saved-post__detail"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(post.detailPath);
                      }}
                    >
                      Chi tiết
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <button
                    className="saved-post__remove"
                    type="button"
                    aria-label={`Bỏ lưu ${post.title}`}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <Trash2 size={17} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="saved-page__empty">
      <span>
        <Heart size={30} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <button type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}
