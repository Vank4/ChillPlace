import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock3,
  FileText,
  Hash,
  MapPin,
  MapPinned,
  Search,
  Sparkles,
  Star
} from "lucide-react";
import { mockFeedPosts, mockTrendingTags } from "../../../data/mockFeed.js";
import {
  getPlaces,
  getRecentSearches,
  getSavedPlaceIds,
  saveRecentSearch,
  toggleSavedPlace
} from "../../../services/place.service.js";
import { PlaceCard } from "../../explore/components/PlaceCard.jsx";
import "../../explore/pages/ExplorePage.css";
import "./SearchResultsPage.css";

const tabs = [
  { id: "places", label: "Địa điểm", icon: MapPin },
  { id: "posts", label: "Bài viết", icon: FileText },
  { id: "hashtags", label: "Hashtag", icon: Hash }
];

const quickFilters = [
  { id: "nearby", label: "Gần tôi" },
  { id: "openNow", label: "Đang mở" },
  { id: "rating", label: "4.5+ sao" },
  { id: "deal", label: "Có ưu đãi" }
];

function normalizeText(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

function matchesKeyword(value, keyword) {
  if (!keyword) {
    return true;
  }

  return normalizeText(value).includes(normalizeText(keyword));
}

function getPostSearchText(post) {
  return [
    post.author.name,
    post.author.username,
    post.place.name,
    post.place.area,
    post.caption,
    ...post.tags
  ].join(" ");
}

export function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(initialKeyword);
  const [submittedKeyword, setSubmittedKeyword] = useState(initialKeyword);
  const [activeTab, setActiveTab] = useState("places");
  const [selectedFilters, setSelectedFilters] = useState(["nearby"]);
  const [places, setPlaces] = useState([]);
  const [savedPlaceIds, setSavedPlaceIds] = useState(() => getSavedPlaceIds());
  const [recentSearches, setRecentSearches] = useState(() => getRecentSearches());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const nextKeyword = searchParams.get("q") || "";
    setKeyword(nextKeyword);
    setSubmittedKeyword(nextKeyword);
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    setError("");

    getPlaces({
      keyword: submittedKeyword,
      nearby: selectedFilters.includes("nearby"),
      openNow: selectedFilters.includes("openNow"),
      minRating: selectedFilters.includes("rating") ? 4.5 : null,
      hasDeal: selectedFilters.includes("deal"),
      delayMs: 280
    })
      .then((nextPlaces) => {
        if (isMounted) {
          setPlaces(nextPlaces);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlaces([]);
          setError("Có lỗi khi tải kết quả tìm kiếm. Anh thử lại giúp em nhé.");
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
  }, [submittedKeyword, selectedFilters]);

  const matchedPosts = useMemo(
    () => mockFeedPosts.filter((post) => matchesKeyword(getPostSearchText(post), submittedKeyword)),
    [submittedKeyword]
  );

  const matchedTags = useMemo(() => {
    const filteredTags = mockTrendingTags.filter((tag) => matchesKeyword(tag.label, submittedKeyword));
    return filteredTags.length > 0 ? filteredTags : mockTrendingTags;
  }, [submittedKeyword]);

  const totalResults = places.length + matchedPosts.length + matchedTags.length;

  function handleSubmit(event) {
    event.preventDefault();
    const cleanKeyword = keyword.trim();

    setSubmittedKeyword(cleanKeyword);
    setSearchParams(cleanKeyword ? { q: cleanKeyword } : {});
    setRecentSearches(saveRecentSearch(cleanKeyword));
  }

  function handleFilterToggle(filterId) {
    setSelectedFilters((currentFilters) =>
      currentFilters.includes(filterId)
        ? currentFilters.filter((item) => item !== filterId)
        : [...currentFilters, filterId]
    );
  }

  function handleRecentSearch(nextKeyword) {
    setKeyword(nextKeyword);
    setSubmittedKeyword(nextKeyword);
    setSearchParams({ q: nextKeyword });
  }

  function handleTagSearch(tag) {
    const nextKeyword = tag.startsWith("#") ? tag.slice(1) : tag;
    navigate(`/tags/${encodeURIComponent(nextKeyword)}`);
    setRecentSearches(saveRecentSearch(nextKeyword));
  }

  function handleToggleSave(placeId) {
    setSavedPlaceIds(toggleSavedPlace(placeId));
  }

  return (
    <div className="search-results-page">
      <section className="search-results-page__main" aria-label="Kết quả tìm kiếm">
        <header className="search-results-page__hero">
          <span className="search-results-page__eyebrow">Search results</span>
          <h1>{submittedKeyword ? `Kết quả cho “${submittedKeyword}”` : "Tìm kiếm ChillPlace"}</h1>
          <p>
            Tổng hợp địa điểm, bài viết review và hashtag liên quan. Dữ liệu đang chạy bằng mock API,
            state và localStorage để mô phỏng luồng tìm kiếm thật.
          </p>
        </header>

        <form className="search-results-page__searchbar" onSubmit={handleSubmit}>
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            value={keyword}
            aria-label="Từ khóa tìm kiếm"
            placeholder="Tìm cafe, rooftop, study..."
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <Search size={18} aria-hidden="true" />
          </button>
        </form>

        <div className="search-results-page__filters" aria-label="Bộ lọc nhanh">
          {quickFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={selectedFilters.includes(filter.id) ? "is-active" : ""}
              onClick={() => handleFilterToggle(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="search-results-page__tabs" role="tablist" aria-label="Loại kết quả">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count =
              tab.id === "places" ? places.length : tab.id === "posts" ? matchedPosts.length : matchedTags.length;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? "is-active" : ""}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} aria-hidden="true" />
                {tab.label}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="search-results-page__summary">
          <div>
            <strong>{totalResults} kết quả liên quan</strong>
            <span>{isLoading ? "Đang tải mock API..." : "Cập nhật theo filter hiện tại."}</span>
          </div>
          <button type="button" onClick={() => navigate(`/map?q=${encodeURIComponent(submittedKeyword)}`)}>
            <MapPinned size={17} aria-hidden="true" />
            Xem trên map
          </button>
        </div>

        {isLoading ? <div className="search-results-page__state">Đang tải kết quả...</div> : null}

        {!isLoading && error ? (
          <div className="search-results-page__state search-results-page__state--error">{error}</div>
        ) : null}

        {!isLoading && !error && activeTab === "places" ? (
          places.length > 0 ? (
            <section className="search-results-page__grid" aria-label="Địa điểm phù hợp">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  isSaved={savedPlaceIds.includes(place.id)}
                  onOpenDetail={(placeId) => navigate(`/places/${placeId}`)}
                  onOpenMap={(placeId) => navigate(`/map?place=${placeId}`)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </section>
          ) : (
            <div className="search-results-page__state">Không có địa điểm phù hợp.</div>
          )
        ) : null}

        {!isLoading && !error && activeTab === "posts" ? (
          matchedPosts.length > 0 ? (
            <section className="search-results-page__post-grid" aria-label="Bài viết phù hợp">
              {matchedPosts.map((post) => (
                <article
                  key={post.id}
                  className="search-results-page__post-card"
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
                  <div>
                    <span>{post.type}</span>
                    <h2>{post.place.name}</h2>
                    <p>{post.caption}</p>
                    <strong>
                      <Star size={14} aria-hidden="true" />
                      {post.place.rating} · {post.stats.likes} lượt thích
                    </strong>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="search-results-page__state">Chưa có bài viết phù hợp.</div>
          )
        ) : null}

        {!isLoading && !error && activeTab === "hashtags" ? (
          <section className="search-results-page__tag-grid" aria-label="Hashtag phù hợp">
            {matchedTags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => handleTagSearch(tag.label)}>
                <Hash size={17} aria-hidden="true" />
                <span>#{tag.label}</span>
                <strong>{tag.count}</strong>
              </button>
            ))}
          </section>
        ) : null}
      </section>

      <aside className="search-results-page__side" aria-label="Gợi ý tìm kiếm">
        <section>
          <div className="search-results-page__side-title">
            <Clock3 size={16} aria-hidden="true" />
            Tìm gần đây
          </div>
          <div className="search-results-page__recent-list">
            {(recentSearches.length > 0 ? recentSearches : ["cafe", "rooftop", "studyspot"]).map((item) => (
              <button key={item} type="button" onClick={() => handleRecentSearch(item)}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="search-results-page__side-title">
            <Sparkles size={16} aria-hidden="true" />
            Gợi ý nhanh
          </div>
          <div className="search-results-page__suggestions">
            {mockTrendingTags.map((tag) => (
              <button key={tag.id} type="button" onClick={() => handleTagSearch(tag.label)}>
                #{tag.label}
                <span>{tag.count}</span>
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
