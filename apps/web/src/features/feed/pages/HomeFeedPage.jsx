import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Heart, MapPin, Menu, Plus, Search, Send, SlidersHorizontal, TrendingUp, X } from "lucide-react";
import { Avatar } from "../../../components/common/Avatar.jsx";
import { mockCurrentUser, mockFeedPosts, mockTrendingTags } from "../../../data/mockFeed.js";
import { FeedItem } from "../components/FeedItem.jsx";
import "./HomeFeedPage.css";

const quickFilters = ["Cafe", "Rooftop", "Study", "Ăn uống"];
const followingUsernames = new Set(["linhchill", "hoanganh.food"]);

const feedChannels = [
  { id: "for-you", label: "For You" },
  { id: "nearby", label: "Gần bạn" },
  { id: "hot", label: "Đang hot" },
  { id: "trending", label: "Xu hướng" },
  { id: "following", label: "Theo dõi" }
];

const commentSamples = [
  {
    id: "c1",
    author: "Minh Nguyen",
    meta: "Vừa xong",
    text: "Chỗ này hợp đi cuối tuần ghê. Ánh sáng trong ảnh nhìn rất chill.",
    likes: 42,
    replies: [
      {
        id: "c1-r1",
        author: "Linh ChillVibes",
        meta: "Vừa xong",
        text: "Đi khoảng 16:30 là đẹp nhất đó anh."
      }
    ]
  },
  {
    id: "c2",
    author: "Linh Chi",
    meta: "12 phút trước",
    text: "Mình đã lưu lại, hôm nào ghé thử rồi review tiếp cho anh em.",
    likes: 18,
    replies: [
      {
        id: "c2-r1",
        author: "Saigon Bites",
        meta: "8 phút trước",
        text: "Nhớ đặt bàn trước nha, cuối tuần hơi đông."
      },
      {
        id: "c2-r2",
        author: "Minh Nguyen",
        meta: "5 phút trước",
        text: "Oke để anh note lại."
      }
    ]
  },
  {
    id: "c3",
    author: "Saigon Bites",
    meta: "1 giờ trước",
    text: "Nếu đi buổi chiều thì nên đặt bàn trước, góc cửa sổ hết khá nhanh.",
    likes: 9,
    replies: []
  }
];

function parseDistance(distance) {
  const value = Number.parseFloat(distance);
  return Number.isNaN(value) ? 99 : value;
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

export function HomeFeedPage() {
  const navigate = useNavigate();
  const [activeFeed, setActiveFeed] = useState("for-you");
  const [sideQuery, setSideQuery] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [commentPostId, setCommentPostId] = useState(null);
  const [isCommentSheetExpanded, setIsCommentSheetExpanded] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const feedListRef = useRef(null);

  const visiblePosts = useMemo(() => {
    if (activeFeed === "nearby") {
      return mockFeedPosts.filter((post) => parseDistance(post.place.distance) <= 3);
    }

    if (activeFeed === "hot" || activeFeed === "trending") {
      return mockFeedPosts.filter((post) => post.isTrending);
    }

    if (activeFeed === "following") {
      return mockFeedPosts.filter((post) => followingUsernames.has(post.author.username));
    }

    return mockFeedPosts;
  }, [activeFeed]);

  const currentCommentPost = useMemo(() => {
    return mockFeedPosts.find((post) => post.id === commentPostId) ?? null;
  }, [commentPostId]);

  const filteredSidePosts = useMemo(() => {
    const query = normalizeText(sideQuery);
    const quickFilter = normalizeText(activeQuickFilter);
    const tag = normalizeText(activeTag);

    return mockFeedPosts.filter((post) => {
      const searchableText = normalizeText([
        post.place.name,
        post.place.area,
        post.author.name,
        post.caption,
        ...post.tags
      ].join(" "));

      if (query && !searchableText.includes(query)) {
        return false;
      }

      if (quickFilter && !searchableText.includes(quickFilter)) {
        return false;
      }

      if (tag && !post.tags.some((postTag) => normalizeText(postTag).includes(tag))) {
        return false;
      }

      return true;
    });
  }, [activeQuickFilter, activeTag, sideQuery]);

  const nearbyPosts = filteredSidePosts
    .filter((post) => parseDistance(post.place.distance) <= 3.5)
    .slice(0, 2);

  const hotPlaces = [...filteredSidePosts]
    .sort((firstPost, secondPost) => secondPost.place.rating - firstPost.place.rating)
    .slice(0, 3);

  const hasSideSearch = sideQuery.trim().length > 0;
  const sideSearchResults = hasSideSearch ? filteredSidePosts.slice(0, 4) : [];

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    feedListRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  function handleChangeFeed(channelId) {
    setActiveFeed(channelId);
    setCommentPostId(null);
    setIsCommentSheetExpanded(false);
    feedListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleQuickFilter(filter) {
    setActiveQuickFilter((currentFilter) => (currentFilter === filter ? "" : filter));
    setActiveTag("");
  }

  function handleTrendingTag(tagLabel) {
    navigate(`/tags/${encodeURIComponent(tagLabel)}`);
  }

  function handleSideSearchSubmit(event) {
    event.preventDefault();
    const cleanQuery = sideQuery.trim();

    if (cleanQuery) {
      navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
    }
  }

  function handleOpenPost(postId) {
    navigate(`/posts/${postId}`);
  }

  function handleToggleComments(postId) {
    setCommentPostId((currentPostId) => {
      const nextPostId = currentPostId === postId ? null : postId;

      if (!nextPostId) {
        setIsCommentSheetExpanded(false);
      }

      return nextPostId;
    });
  }

  function handleSubmitComment(event) {
    event.preventDefault();
    setCommentDraft("");
  }

  return (
    <div className={commentPostId ? "home-feed-page has-comments" : "home-feed-page"}>
      <section className="home-feed-page__main" aria-label="Feed dành cho bạn">
        <div className="home-feed-page__reels-chrome" aria-label="Điều hướng ChillPlace Reels">
          <div className="home-feed-page__reels-topbar">
            <strong>ChillPlace Reels</strong>

            <div className="home-feed-page__reels-channel-rail" role="tablist" aria-label="Kênh feed">
              {feedChannels.map((channel) => (
                <button
                  className={activeFeed === channel.id ? "is-active" : ""}
                  key={channel.id}
                  type="button"
                  role="tab"
                  aria-selected={activeFeed === channel.id}
                  onClick={() => handleChangeFeed(channel.id)}
                >
                  {channel.label}
                </button>
              ))}
            </div>

            <div className="home-feed-page__reels-actions">
              <button className="home-feed-page__reels-menu-button" type="button" aria-label="Mở tuỳ chọn feed">
                <Menu size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="home-feed-page__list" ref={feedListRef}>
          {visiblePosts.map((post, index) => (
            <FeedItem
              key={post.id}
              post={post}
              priority={index === 0}
              isCommentsOpen={commentPostId === post.id}
              onToggleComments={() => handleToggleComments(post.id)}
            />
          ))}
        </div>
      </section>

      {currentCommentPost ? (
        <button
          className="home-feed-page__comment-backdrop"
          type="button"
          aria-label="Đóng bình luận"
          onClick={() => {
            setCommentPostId(null);
            setIsCommentSheetExpanded(false);
          }}
        />
      ) : null}

      <CommentDock
        post={currentCommentPost}
        draft={commentDraft}
        isExpanded={isCommentSheetExpanded}
        onDraftChange={setCommentDraft}
        onClose={() => {
          setCommentPostId(null);
          setIsCommentSheetExpanded(false);
        }}
        onExpand={() => setIsCommentSheetExpanded(true)}
        onCollapse={() => setIsCommentSheetExpanded(false)}
        onSubmit={handleSubmitComment}
      />

      <section className="home-feed-page__side" aria-label="Gợi ý khám phá">
        <form className="home-feed-page__search" role="search" onSubmit={handleSideSearchSubmit}>
          <Search size={13} aria-hidden="true" />
          <input
            type="search"
            value={sideQuery}
            placeholder="Tìm kiếm không gian..."
            aria-label="Tìm kiếm không gian"
            onChange={(event) => setSideQuery(event.target.value)}
          />
          <button className="home-feed-page__search-submit" type="submit" aria-label="Xem trang kết quả tìm kiếm">
            <ArrowRight size={12} aria-hidden="true" />
          </button>
        </form>

        {hasSideSearch ? (
          <article className="home-feed-page__side-card home-feed-page__search-results" aria-live="polite">
            <div className="home-feed-page__side-heading">
              <h2>Kết quả tìm kiếm</h2>
              <button type="button" onClick={handleSideSearchSubmit}>
                Xem tất cả
              </button>
            </div>

            {sideSearchResults.length > 0 ? (
              <div className="home-feed-page__search-result-list">
                {sideSearchResults.map((post) => (
                  <button
                    className="home-feed-page__search-result"
                    key={post.id}
                    type="button"
                    onClick={() => handleOpenPost(post.id)}
                  >
                    <img src={post.mediaUrl} alt="" loading="lazy" decoding="async" />
                    <span>
                      <strong>{post.place.name}</strong>
                      <small>
                        <MapPin size={10} aria-hidden="true" />
                        {post.place.area} · {post.place.rating} ★
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="home-feed-page__search-empty">Không có kết quả phù hợp.</div>
            )}
          </article>
        ) : null}

        <article className="home-feed-page__side-card">
          <div className="home-feed-page__side-heading">
            <h2>Xu hướng</h2>
            <TrendingUp size={13} aria-hidden="true" />
          </div>

          <div className="home-feed-page__trend-tags">
            {mockTrendingTags.map((tag) => (
              <button
                className={activeTag === tag.label ? "is-active" : ""}
                key={tag.id}
                type="button"
                onClick={() => handleTrendingTag(tag.label)}
              >
                #{tag.label}
              </button>
            ))}
          </div>
        </article>

        <article className="home-feed-page__side-card">
          <div className="home-feed-page__side-heading">
            <h2>Bộ lọc nhanh</h2>
            <SlidersHorizontal size={13} aria-hidden="true" />
          </div>

          <div className="home-feed-page__quick-filters">
            {quickFilters.map((filter) => (
              <button
                className={activeQuickFilter === filter ? "is-active" : ""}
                key={filter}
                type="button"
                onClick={() => handleQuickFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </article>

        <article className="home-feed-page__side-card">
          <div className="home-feed-page__side-heading">
            <h2>Gần bạn</h2>
            <button type="button" onClick={() => navigate("/nearby")}>
              Xem thêm
            </button>
          </div>

          <div className="home-feed-page__map-preview" aria-hidden="true">
            <span />
          </div>

          <div className="home-feed-page__nearby-list">
            {nearbyPosts.map((post) => (
              <button className="home-feed-page__nearby-item" key={post.id} type="button" onClick={() => handleChangeFeed("nearby")}>
                <img src={post.mediaUrl} alt="" loading="lazy" decoding="async" />
                <span>
                  <strong>{post.place.name}</strong>
                  <small>
                    {post.place.distance} · Đang được lưu
                  </small>
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="home-feed-page__side-card">
          <div className="home-feed-page__side-heading">
            <h2>Địa điểm hot</h2>
            <Flame size={13} aria-hidden="true" />
          </div>

          <div className="home-feed-page__hot-list">
            {hotPlaces.map((post, index) => (
              <button className="home-feed-page__hot-item" key={post.id} type="button" onClick={() => handleChangeFeed("hot")}>
                <span>{index + 1}</span>
                <strong>{post.place.name}</strong>
                <small>{post.place.rating} ★</small>
              </button>
            ))}
          </div>
        </article>

        <button className="home-feed-page__quick-add" type="button">
          <Plus size={16} aria-hidden="true" />
          Tạo bài viết
        </button>
      </section>
    </div>
  );
}

function CommentDock({ post, draft, isExpanded, onDraftChange, onClose, onExpand, onCollapse, onSubmit }) {
  const [likedCommentIds, setLikedCommentIds] = useState(() => new Set());
  const [expandedReplyIds, setExpandedReplyIds] = useState(() => new Set());
  const dragStartYRef = useRef(null);

  if (!post) {
    return null;
  }

  function toggleCommentLike(commentId) {
    setLikedCommentIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(commentId)) {
        nextIds.delete(commentId);
      } else {
        nextIds.add(commentId);
      }

      return nextIds;
    });
  }

  function toggleReplies(commentId) {
    setExpandedReplyIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(commentId)) {
        nextIds.delete(commentId);
      } else {
        nextIds.add(commentId);
      }

      return nextIds;
    });
  }

  function handleDragStart(event) {
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleDragEnd(event) {
    if (dragStartYRef.current === null) {
      return;
    }

    const deltaY = event.clientY - dragStartYRef.current;
    dragStartYRef.current = null;

    if (deltaY < -48) {
      onExpand();
      return;
    }

    if (deltaY > 48) {
      if (isExpanded) {
        onCollapse();
      } else {
        onClose();
      }
    }
  }

  return (
    <aside
      className={isExpanded ? "home-feed-page__comments is-expanded" : "home-feed-page__comments"}
      aria-label="Bình luận bài viết"
    >
      <header
        onPointerDown={handleDragStart}
        onPointerUp={handleDragEnd}
        onPointerCancel={() => {
          dragStartYRef.current = null;
        }}
      >
        <span className="home-feed-page__comment-grip" aria-hidden="true" />
        <div>
          <strong>Bình luận</strong>
          <span>{post.stats.comments} phản hồi</span>
        </div>
        <button type="button" aria-label="Đóng bình luận" onClick={onClose}>
          <X size={18} />
        </button>
      </header>

      <div className="home-feed-page__comment-list">
        {commentSamples.map((comment) => {
          const isLiked = likedCommentIds.has(comment.id);
          const isRepliesOpen = expandedReplyIds.has(comment.id);

          return (
            <article key={comment.id}>
              <Avatar src={mockCurrentUser.avatarUrl} alt="" size="sm" />
              <div>
                <strong>{comment.author}</strong>
                <p>{comment.text}</p>
                <div className="home-feed-page__comment-meta">
                  <span>
                    {comment.meta} · {comment.likes + (isLiked ? 1 : 0)} thích
                  </span>
                  <button type="button" onClick={() => toggleReplies(comment.id)}>
                    Trả lời
                  </button>
                  {comment.replies.length > 0 ? (
                    <button type="button" onClick={() => toggleReplies(comment.id)}>
                      {isRepliesOpen ? "Ẩn phản hồi" : `Xem ${comment.replies.length} phản hồi`}
                    </button>
                  ) : null}
                </div>

                {isRepliesOpen ? (
                  <div className="home-feed-page__reply-list">
                    {comment.replies.map((reply) => (
                      <div className="home-feed-page__reply" key={reply.id}>
                        <Avatar src={mockCurrentUser.avatarUrl} alt="" size="sm" />
                        <div>
                          <strong>{reply.author}</strong>
                          <p>{reply.text}</p>
                          <span>{reply.meta}</span>
                        </div>
                      </div>
                    ))}
                    <label className="home-feed-page__reply-box">
                      <input placeholder={`Trả lời ${comment.author}...`} />
                      <button type="button">Gửi</button>
                    </label>
                  </div>
                ) : null}
              </div>
              <button
                className={isLiked ? "home-feed-page__comment-like is-liked" : "home-feed-page__comment-like"}
                type="button"
                aria-label={isLiked ? "Bỏ thích bình luận" : "Thích bình luận"}
                aria-pressed={isLiked}
                onClick={() => toggleCommentLike(comment.id)}
              >
                <Heart size={15} />
              </button>
            </article>
          );
        })}
      </div>

      <form className="home-feed-page__comment-form" onSubmit={onSubmit}>
        <Avatar src={mockCurrentUser.avatarUrl} alt="" size="sm" />
        <input
          value={draft}
          placeholder="Thêm bình luận..."
          onChange={(event) => onDraftChange(event.target.value)}
        />
        <button type="submit" aria-label="Gửi bình luận">
          <Send size={16} />
        </button>
      </form>
    </aside>
  );
}
