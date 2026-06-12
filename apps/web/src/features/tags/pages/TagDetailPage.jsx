import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Hash,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
  TrendingUp
} from "lucide-react";
import { TagChip } from "../../../components/common/TagChip.jsx";
import { mockFeedPosts, mockTrendingTags } from "../../../data/mockFeed.js";
import {
  getPlaces,
  getSavedPlaceIds,
  toggleSavedPlace
} from "../../../services/place.service.js";
import { PlaceCard } from "../../explore/components/PlaceCard.jsx";
import "../../explore/pages/ExplorePage.css";
import "./TagDetailPage.css";

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Ä‘/g, "d");
}

function getPostSearchText(post) {
  return [
    post.type,
    post.author.name,
    post.author.username,
    post.place.name,
    post.place.area,
    post.caption,
    ...post.tags
  ].join(" ");
}

function getRelatedTags(currentTag) {
  return mockTrendingTags
    .map((tag) => tag.label)
    .filter((tag) => normalizeText(tag) !== normalizeText(currentTag))
    .slice(0, 6);
}

export function TagDetailPage() {
  const navigate = useNavigate();
  const { tag = "cafe" } = useParams();
  const cleanTag = decodeURIComponent(tag).replace(/^#/, "");
  const normalizedTag = normalizeText(cleanTag);
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => getSavedPlaceIds());

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getPlaces({ keyword: cleanTag, delayMs: 240 })
      .then((nextPlaces) => {
        if (isMounted) {
          setPlaces(nextPlaces);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [cleanTag]);

  const matchedPosts = useMemo(
    () =>
      mockFeedPosts.filter((post) => {
        const hasExactTag = post.tags.some((item) => normalizeText(item) === normalizedTag);
        return hasExactTag || normalizeText(getPostSearchText(post)).includes(normalizedTag);
      }),
    [normalizedTag]
  );

  const visiblePosts = activeTab === "places" ? [] : matchedPosts;
  const visiblePlaces = activeTab === "posts" ? [] : places;
  const relatedTags = getRelatedTags(cleanTag);
  const featuredPost = matchedPosts[0];
  const totalEngagement = matchedPosts.reduce((total, post) => {
    const numericLikes = Number.parseFloat(post.stats.likes.replace("k", "")) || 0;
    return total + numericLikes;
  }, 0);

  function handleToggleSave(placeId) {
    setSavedPlaceIds(toggleSavedPlace(placeId));
  }

  return (
    <div className="tag-detail-page">
      <section className="tag-detail-page__main" aria-label={`Nội dung hashtag ${cleanTag}`}>
        <header className="tag-detail-page__hero">
          <div className="tag-detail-page__hash-mark" aria-hidden="true">
            <Hash size={34} />
          </div>
          <div className="tag-detail-page__hero-copy">
            <span>Hashtag đang khám phá</span>
            <h1>#{cleanTag}</h1>
            <p>
              Tổng hợp bài review, địa điểm và vibe liên quan đến hashtag này từ mock feed, mock API
              địa điểm và state lưu nội dung.
            </p>
          </div>
          <div className="tag-detail-page__hero-actions">
            <button
              type="button"
              className="tag-detail-page__follow"
              onClick={() => navigate(`/search?q=${encodeURIComponent(cleanTag)}`)}
            >
              <Search size={17} aria-hidden="true" />
              <span>Tìm sâu hơn</span>
            </button>
          </div>
        </header>

        <div className="tag-detail-page__stats" aria-label="Thống kê hashtag">
          <div>
            <strong>{matchedPosts.length}</strong>
            <span>Bài viết</span>
          </div>
          <div>
            <strong>{places.length}</strong>
            <span>Địa điểm</span>
          </div>
          <div>
            <strong>{totalEngagement.toFixed(1)}k</strong>
            <span>Lượt thích</span>
          </div>
        </div>

        <div className="tag-detail-page__related" aria-label="Hashtag liên quan">
          {relatedTags.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => navigate(`/tags/${encodeURIComponent(item)}`)}
            >
              #{item}
            </button>
          ))}
        </div>

        <div className="tag-detail-page__tabs" role="tablist" aria-label="Bộ lọc nội dung hashtag">
          {[
            { id: "all", label: "Tất cả", count: matchedPosts.length + places.length },
            { id: "posts", label: "Bài viết", count: matchedPosts.length },
            { id: "places", label: "Địa điểm", count: places.length }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? "is-active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              <span>{tab.count}</span>
            </button>
          ))}
        </div>

        {featuredPost && activeTab !== "places" ? (
          <article
            className="tag-detail-page__featured"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/posts/${featuredPost.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(`/posts/${featuredPost.id}`);
              }
            }}
          >
            <img src={featuredPost.mediaUrl} alt={featuredPost.alt} loading="lazy" decoding="async" />
            <div className="tag-detail-page__featured-copy">
              <span>
                <TrendingUp size={15} aria-hidden="true" />
                Bài nổi bật
              </span>
              <h2>{featuredPost.place.name}</h2>
              <p>{featuredPost.caption}</p>
              <div>
                {featuredPost.tags.slice(0, 3).map((item) => (
                  <TagChip key={item} onClick={(tagValue) => navigate(`/tags/${encodeURIComponent(tagValue)}`)}>
                    {item}
                  </TagChip>
                ))}
              </div>
            </div>
          </article>
        ) : null}

        {isLoading ? <div className="tag-detail-page__state">Đang tải nội dung hashtag...</div> : null}

        {!isLoading && visiblePosts.length === 0 && visiblePlaces.length === 0 ? (
          <div className="tag-detail-page__state">
            Chưa có dữ liệu phù hợp cho #{cleanTag}. Anh thử hashtag khác nhé.
          </div>
        ) : null}

        {!isLoading && visiblePosts.length > 0 ? (
          <section className="tag-detail-page__post-grid" aria-label="Bài viết theo hashtag">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className="tag-detail-page__post-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/posts/${post.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/posts/${post.id}`);
                  }
                }}
              >
                <img src={post.mediaUrl} alt={post.alt} loading="lazy" decoding="async" />
                <div className="tag-detail-page__post-overlay">
                  <span>{post.type}</span>
                  <h3>{post.place.name}</h3>
                  <p>{post.author.name} · {post.createdAt}</p>
                  <div>
                    <span>
                      <Heart size={14} aria-hidden="true" />
                      {post.stats.likes}
                    </span>
                    <span>
                      <MessageCircle size={14} aria-hidden="true" />
                      {post.stats.comments}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {!isLoading && visiblePlaces.length > 0 ? (
          <section className="tag-detail-page__places" aria-label="Địa điểm theo hashtag">
            <div className="tag-detail-page__section-heading">
              <h2>Địa điểm liên quan</h2>
              <button type="button" onClick={() => navigate(`/map?q=${encodeURIComponent(cleanTag)}`)}>
                Xem trên map
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="explore-page__results-grid tag-detail-page__place-grid">
              {visiblePlaces.map((place) => (
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
          </section>
        ) : null}
      </section>

      <aside className="tag-detail-page__side" aria-label="Thông tin hashtag">
        <section>
          <div className="tag-detail-page__side-title">
            <Sparkles size={17} aria-hidden="true" />
            Xu hướng liên quan
          </div>
          {mockTrendingTags.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="tag-detail-page__trend"
              onClick={() => navigate(`/tags/${encodeURIComponent(item.label)}`)}
            >
              <span>{index + 1}</span>
              <strong>#{item.label}</strong>
              <em>{item.count}</em>
            </button>
          ))}
        </section>

        <section>
          <div className="tag-detail-page__side-title">
            <Bookmark size={17} aria-hidden="true" />
            Gợi ý dùng hashtag
          </div>
          <p className="tag-detail-page__tip">
            Khi tạo bài viết, hashtag giúp gom nội dung theo mood, khu vực và nhu cầu. Trang này đã
            sẵn sàng để nối API `/api/tags/:tag`.
          </p>
        </section>

        <section className="tag-detail-page__map-teaser">
          <MapPin size={22} aria-hidden="true" />
          <div>
            <strong>Khám phá quanh bạn</strong>
            <span>{places.length} địa điểm đang khớp #{cleanTag}</span>
          </div>
          <button type="button" onClick={() => navigate(`/map?q=${encodeURIComponent(cleanTag)}`)}>
            Mở map
          </button>
        </section>
      </aside>
    </div>
  );
}
