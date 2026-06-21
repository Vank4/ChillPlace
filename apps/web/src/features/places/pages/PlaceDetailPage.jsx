import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Share2,
  Sparkles,
  Star,
  Wallet,
  Wifi
} from "lucide-react";
import { Button } from "../../../components/common/Button.jsx";
import { TagChip } from "../../../components/common/TagChip.jsx";
import {
  getPlaceById,
  getPlaces,
  getSavedPlaceIds,
  toggleSavedPlace
} from "../../../services/place.service.js";
import { getOpeningStatus } from "../../../utils/openingStatus.js";
import "./PlaceDetailPage.css";

const USER_REVIEWS_KEY = "chillplace.userReviews";

const defaultReviews = [
  {
    name: "Linh ChillVibes",
    meta: "Creator review",
    rating: 4.8,
    text: "Không gian sáng, bàn rộng và ổ cắm dễ tìm. Hợp để ngồi làm việc lâu mà vẫn thấy thoải mái."
  },
  {
    name: "Minh Nguyen",
    meta: "Đã ghé tuần này",
    rating: 4.6,
    text: "Nhân viên dễ thương, khu vực ngồi khá yên. Mình thích nhất phần ánh sáng và playlist nhẹ."
  }
];

const amenities = [
  { icon: Wifi, label: "Wifi ổn định" },
  { icon: Sparkles, label: "Góc chụp đẹp" },
  { icon: MessageCircle, label: "Không gian chill" },
  { icon: Clock, label: "Phù hợp ngồi lâu" }
];

function readUserReviews() {
  try {
    const rawValue = window.localStorage.getItem(USER_REVIEWS_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

function writeUserReviews(nextReviews) {
  window.localStorage.setItem(USER_REVIEWS_KEY, JSON.stringify(nextReviews));
}

export function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [relatedPlaces, setRelatedPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [userReviews, setUserReviews] = useState(() => readUserReviews());
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [draftRating, setDraftRating] = useState(5);
  const [draftText, setDraftText] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const reviewsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPlace() {
      setIsLoading(true);
      const [placeResult, placesResult] = await Promise.all([getPlaceById(placeId), getPlaces({ delayMs: 120 })]);

      if (!isMounted) return;

      setPlace(placeResult);
      setRelatedPlaces(
        placesResult
          .filter((item) => item.id !== placeResult?.id)
          .slice(0, 3)
      );
      setIsSaved(placeResult ? getSavedPlaceIds().includes(placeResult.id) : false);
      setIsLoading(false);
    }

    loadPlace();

    return () => {
      isMounted = false;
    };
  }, [placeId]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => window.clearInterval(timerId);
  }, []);

  const userReview = useMemo(() => {
    return place ? userReviews[place.id] : null;
  }, [place, userReviews]);

  useEffect(() => {
    if (!place) return;

    const savedReview = userReviews[place.id];
    setDraftRating(savedReview?.rating ?? 5);
    setDraftText(savedReview?.text ?? "");
    setIsEditingReview(!savedReview);
  }, [place, userReviews]);

  function handleToggleSaved() {
    if (!place) return;
    const wasSaved = isSaved;
    const nextSavedIds = toggleSavedPlace(place.id);
    setIsSaved(nextSavedIds.includes(place.id));
    setSaveFeedback(wasSaved ? "unsave" : "save");
    window.setTimeout(() => setSaveFeedback(""), 520);
  }

  function handleScrollToReviews() {
    reviewsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  function handleSaveReview(event) {
    event.preventDefault();
    if (!place) return;

    const cleanText = draftText.trim();
    const nextReview = {
      rating: draftRating,
      text: cleanText || "Mình đã ghé nơi này và muốn lưu lại trải nghiệm khá ổn.",
      updatedAt: "Hôm nay"
    };
    const nextReviews = { ...userReviews, [place.id]: nextReview };

    setUserReviews(nextReviews);
    writeUserReviews(nextReviews);
    setIsEditingReview(false);
  }

  if (isLoading) {
    return <main className="place-detail place-detail__state">Đang tải chi tiết địa điểm...</main>;
  }

  if (!place) {
    return <main className="place-detail place-detail__state">Không tìm thấy địa điểm phù hợp.</main>;
  }

  const openingStatus = getOpeningStatus(place.openingHours, currentTime);
  const statusLabel = openingStatus.label;

  return (
    <main className="place-detail">
      <div className="place-detail__toolbar">
        <button className="place-detail__icon-action" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Quay lại</span>
        </button>
      </div>

      <section className="place-detail__hero" aria-label={`Ảnh đại diện ${place.name}`}>
        <img src={place.imageUrl} alt={place.alt} loading="eager" decoding="async" fetchPriority="high" />
        <div className="place-detail__hero-overlay">
          <span className={`place-detail__status-dot place-detail__status-dot--${openingStatus.tone}`}>
            <span aria-hidden="true" />
            <strong>{statusLabel}</strong>
          </span>
          <div className="place-detail__hero-actions" aria-label="Tác vụ địa điểm">
            <button className="place-detail__hero-action" type="button" aria-label="Chia sẻ địa điểm">
              <Share2 size={18} />
            </button>
            <button
              className={`place-detail__hero-action ${isSaved ? "is-saved" : ""} ${
                saveFeedback ? `is-${saveFeedback}` : ""
              }`}
              type="button"
              aria-label={isSaved ? "Bỏ lưu địa điểm" : "Lưu địa điểm"}
              onClick={handleToggleSaved}
            >
              <Bookmark size={18} />
            </button>
            <button
              className="place-detail__rating-pill"
              type="button"
              aria-label="Xem phần đánh giá"
              onClick={handleScrollToReviews}
            >
              <Star size={16} />
              {place.rating}
            </button>
          </div>
        </div>
      </section>

      <div className="place-detail__layout">
        <div className="place-detail__main">
          <section className="place-detail__summary-card">
            <div className="place-detail__eyebrow">
              <span>{place.category}</span>
              <small>{place.reviewCount} reviews</small>
            </div>
            <h1>{place.name}</h1>
            <p className="place-detail__location">
              <MapPin size={18} />
              <span>
                {place.area} · cách anh khoảng {place.distance}
              </span>
            </p>
            <p className="place-detail__description">{place.description}</p>
            <div className="place-detail__tags" aria-label="Hashtag địa điểm">
              {place.tags.map((tag) => (
                <TagChip key={tag} onClick={(tagValue) => navigate(`/tags/${encodeURIComponent(tagValue)}`)}>
                  {tag}
                </TagChip>
              ))}
            </div>

            <div className="place-detail__facts">
              <div>
                <Clock />
                <span>Trạng thái</span>
                <strong>{statusLabel}</strong>
              </div>
              <div>
                <Wallet />
                <span>Khoảng giá</span>
                <strong>{place.priceRange}</strong>
              </div>
              <div>
                <MessageCircle />
                <span>Đánh giá</span>
                <strong>
                  {place.rating} sao từ {place.reviewCount} review
                </strong>
              </div>
            </div>

            <div className="place-detail__actions">
              <Button
                className="place-detail__direction-button"
                type="button"
                onClick={() => navigate(`/map?place=${place.id}`)}
              >
                <Navigation size={18} />
                Chỉ đường
              </Button>
              <Button
                className="place-detail__save-button"
                variant="ghost"
                type="button"
                onClick={handleToggleSaved}
              >
                <Bookmark size={18} />
                {isSaved ? "Đã lưu" : "Lưu địa điểm"}
              </Button>
            </div>
          </section>

          <section className="place-detail__section">
            <h2>Tiện ích nổi bật</h2>
            <div className="place-detail__amenities">
              {amenities.map(({ icon: Icon, label }) => (
                <div key={label}>
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="place-detail__section" ref={reviewsRef}>
            <div className="place-detail__section-heading">
              <h2>Review gần đây</h2>
              <span>{place.reviewCount} lượt đánh giá</span>
            </div>

            {userReview && !isEditingReview ? (
              <article className="place-detail__user-review">
                <div>
                  <strong>Đánh giá của anh</strong>
                  <span>{userReview.updatedAt}</span>
                </div>
                <small>
                  <Star size={15} />
                  {userReview.rating.toFixed(1)}
                </small>
                <p>{userReview.text}</p>
                <button type="button" onClick={() => setIsEditingReview(true)}>
                  Cập nhật đánh giá
                </button>
              </article>
            ) : (
              <form className="place-detail__review-form" onSubmit={handleSaveReview}>
                <div>
                  <strong>{userReview ? "Cập nhật đánh giá của anh" : "Anh đã ghé nơi này chưa?"}</strong>
                  <span>Chọn số sao và ghi lại cảm nhận để mock app lưu vào localStorage.</span>
                </div>
                <div className="place-detail__rating-input" aria-label="Chọn số sao">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      className={rating <= draftRating ? "is-active" : ""}
                      type="button"
                      aria-label={`${rating} sao`}
                      onClick={() => setDraftRating(rating)}
                    >
                      <Star size={18} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={draftText}
                  placeholder="Chia sẻ cảm nhận về không gian, dịch vụ hoặc điểm anh thích..."
                  onChange={(event) => setDraftText(event.target.value)}
                />
                <button className="place-detail__review-submit" type="submit">
                  Lưu đánh giá
                </button>
              </form>
            )}

            <div className="place-detail__reviews">
              {defaultReviews.map((review) => (
                <article key={review.name}>
                  <div>
                    <strong>{review.name}</strong>
                    <span>{review.meta}</span>
                  </div>
                  <small>
                    <Star size={14} />
                    {review.rating}
                  </small>
                  <p>{review.text}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="place-detail__aside" aria-label="Thông tin bản đồ và gợi ý">
          <section className="place-detail__map-card">
            <div className="place-detail__mini-map">
              <MapPin />
            </div>
            <h2>Vị trí trên bản đồ</h2>
            <p>
              {place.area} · cách anh khoảng {place.distance}. Mở bản đồ để xem các địa điểm cùng khu vực.
            </p>
            <Button
              className="place-detail__map-button"
              type="button"
              onClick={() => navigate(`/map?place=${place.id}`)}
            >
              <Navigation size={18} />
              Mở bản đồ
            </Button>
          </section>

          <section className="place-detail__related">
            <h2>Gợi ý gần đó</h2>
            {relatedPlaces.map((item) => (
              <button key={item.id} type="button" onClick={() => navigate(`/places/${item.id}`)}>
                <img src={item.imageUrl} alt={item.alt} loading="lazy" decoding="async" />
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.area} · {item.distance}
                  </small>
                </span>
              </button>
            ))}
          </section>
        </aside>
      </div>
    </main>
  );
}
