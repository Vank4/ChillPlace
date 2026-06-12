import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  Star,
  X
} from "lucide-react";
import { Avatar } from "../../../components/common/Avatar.jsx";
import { mockCurrentUser, mockFeedPosts } from "../../../data/mockFeed.js";
import "./PostDetailPage.css";

const fallbackPostMap = {
  sp1: "post-1",
  sp2: "post-3"
};

const comments = [
  {
    id: "c1",
    author: "Minh Nguyen",
    meta: "Vừa xong",
    text: "Góc này hợp đi cuối tuần ghê. Ánh sáng trong ảnh nhìn rất chill.",
    likes: 43
  },
  {
    id: "c2",
    author: "Linh Chi",
    meta: "12 phút trước",
    text: "Mình đã lưu lại, hôm nào ghé thử rồi review tiếp cho anh em.",
    likes: 19
  },
  {
    id: "c3",
    author: "Saigon Bites",
    meta: "1 giờ trước",
    text: "Nếu đi buổi chiều thì nên đặt bàn trước, góc cửa sổ hết khá nhanh.",
    likes: 10
  },
  {
    id: "c4",
    author: "Thảo Foodie",
    meta: "2 giờ trước",
    text: "Có chỗ gửi xe gần đó không mọi người?",
    likes: 6
  }
];

function resolvePost(postId) {
  const resolvedId = fallbackPostMap[postId] ?? postId;
  return mockFeedPosts.find((post) => post.id === resolvedId) ?? mockFeedPosts[0];
}

export function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = useMemo(() => resolvePost(postId), [postId]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [likedCommentIds, setLikedCommentIds] = useState(() => new Set());
  const [draft, setDraft] = useState("");

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

  function handleSubmitComment(event) {
    event.preventDefault();
    setDraft("");
  }

  return (
    <main className="post-detail-page">
      <section className="post-detail-page__media-zone" aria-label="Nội dung bài viết">
        <img className="post-detail-page__ambient" src={post.mediaUrl} alt="" aria-hidden="true" />

        <div className="post-detail-page__mobile-topbar">
          <button type="button" aria-label="Quay lại" onClick={() => navigate(-1)}>
            <ArrowLeft size={19} />
          </button>
          <strong>ChillPlace Reels</strong>
          <button type="button" aria-label="Tùy chọn bài viết">
            <MoreHorizontal size={19} />
          </button>
        </div>

        <article className={`post-detail-page__media-frame post-detail-page__media-frame--${post.mediaRatio}`}>
          <img src={post.mediaUrl} alt={post.alt} loading="eager" decoding="async" />
          <div className="post-detail-page__media-scrim" />

          <div className="post-detail-page__mobile-caption">
            <div className="post-detail-page__author-line">
              <Avatar src={post.author.avatarUrl} alt="" size="sm" />
              <div>
                <strong>{post.author.name}</strong>
                <span>@{post.author.username} · {post.createdAt}</span>
              </div>
              <button
                className={isFollowing ? "is-following" : ""}
                type="button"
                onClick={() => setIsFollowing((current) => !current)}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            </div>
            <h1>{post.place.name}</h1>
            <p>{post.caption}</p>
            <div className="post-detail-page__tag-row">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </article>

        <ActionRail
          post={post}
          isLiked={isLiked}
          isSaved={isSaved}
          onToggleLike={() => setIsLiked((current) => !current)}
          onToggleSave={() => setIsSaved((current) => !current)}
          onToggleComments={() => setIsCommentsOpen((current) => !current)}
        />
      </section>

      <aside className="post-detail-page__info" aria-label="Thông tin và bình luận bài viết">
        <header className="post-detail-page__desktop-head">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Quay lại
          </button>
          <div>
            <button type="button" aria-label="Chia sẻ bài viết">
              <Share2 size={18} />
            </button>
            <button
              className={isSaved ? "is-saved" : ""}
              type="button"
              aria-label={isSaved ? "Bỏ lưu bài viết" : "Lưu bài viết"}
              onClick={() => setIsSaved((current) => !current)}
            >
              <Bookmark size={18} />
            </button>
          </div>
        </header>

        <div className="post-detail-page__author-card">
          <Avatar src={post.author.avatarUrl} alt="" size="lg" />
          <div>
            <strong>{post.author.name}</strong>
            <span>@{post.author.username} · {post.createdAt}</span>
          </div>
          <button
            className={isFollowing ? "is-following" : ""}
            type="button"
            onClick={() => setIsFollowing((current) => !current)}
          >
            {isFollowing ? <Check size={15} /> : null}
            {isFollowing ? "Đang theo dõi" : "Theo dõi"}
          </button>
        </div>

        <section className="post-detail-page__copy">
          <span className="post-detail-page__eyebrow">{post.type}</span>
          <h1>{post.place.name}</h1>
          <p>{post.caption}</p>

          <div className="post-detail-page__place-link">
            <MapPin size={16} />
            <Link to={`/map?place=${post.id}`}>{post.place.area} · {post.place.distance}</Link>
            <span>
              <Star size={15} />
              {post.place.rating}
            </span>
          </div>

          <div className="post-detail-page__tag-row">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/tags/${encodeURIComponent(tag)}`)}
              >
                #{tag}
              </button>
            ))}
          </div>
        </section>

        <section className="post-detail-page__stats" aria-label="Tương tác bài viết">
          <button className={isLiked ? "is-liked" : ""} type="button" onClick={() => setIsLiked((current) => !current)}>
            <Heart size={19} />
            <span>{post.stats.likes}</span>
            <small>Thích</small>
          </button>
          <button type="button" onClick={() => setIsCommentsOpen((current) => !current)}>
            <MessageCircle size={19} />
            <span>{post.stats.comments}</span>
            <small>Bình luận</small>
          </button>
          <button type="button">
            <Share2 size={19} />
            <span>{post.stats.shares}</span>
            <small>Chia sẻ</small>
          </button>
        </section>

        <CommentPanel
          post={post}
          draft={draft}
          isOverlay={false}
          likedCommentIds={likedCommentIds}
          onDraftChange={setDraft}
          onSubmit={handleSubmitComment}
          onToggleLike={toggleCommentLike}
        />
      </aside>

      {isCommentsOpen ? (
        <CommentPanel
          post={post}
          draft={draft}
          isOverlay
          likedCommentIds={likedCommentIds}
          onClose={() => setIsCommentsOpen(false)}
          onDraftChange={setDraft}
          onSubmit={handleSubmitComment}
          onToggleLike={toggleCommentLike}
        />
      ) : null}
    </main>
  );
}

function ActionRail({ post, isLiked, isSaved, onToggleLike, onToggleSave, onToggleComments }) {
  return (
    <div className="post-detail-page__actions" aria-label="Tương tác nhanh">
      <button className={isLiked ? "is-liked" : ""} type="button" aria-label="Thích bài viết" onClick={onToggleLike}>
        <Heart size={23} />
        <span>{post.stats.likes}</span>
      </button>
      <button type="button" aria-label="Mở bình luận" onClick={onToggleComments}>
        <MessageCircle size={23} />
        <span>{post.stats.comments}</span>
      </button>
      <button className={isSaved ? "is-saved" : ""} type="button" aria-label="Lưu bài viết" onClick={onToggleSave}>
        <Bookmark size={23} />
        <span>{post.stats.saves}</span>
      </button>
      <button type="button" aria-label="Chia sẻ bài viết">
        <Send size={23} />
        <span>{post.stats.shares}</span>
      </button>
    </div>
  );
}

function CommentPanel({
  post,
  draft,
  isOverlay,
  likedCommentIds,
  onClose,
  onDraftChange,
  onSubmit,
  onToggleLike
}) {
  return (
    <section className={isOverlay ? "post-comments post-comments--overlay" : "post-comments"} aria-label="Bình luận">
      {isOverlay ? <button className="post-comments__backdrop" type="button" aria-label="Đóng bình luận" onClick={onClose} /> : null}

      <div className="post-comments__panel">
        <header>
          <div>
            <strong>Bình luận</strong>
            <span>{post.stats.comments} phản hồi</span>
          </div>
          {isOverlay ? (
            <button type="button" aria-label="Đóng bình luận" onClick={onClose}>
              <X size={18} />
            </button>
          ) : null}
        </header>

        <div className="post-comments__list">
          {comments.map((comment) => {
            const isCommentLiked = likedCommentIds.has(comment.id);

            return (
              <article key={comment.id}>
                <Avatar src={mockCurrentUser.avatarUrl} alt="" size="sm" />
                <div>
                  <strong>{comment.author}</strong>
                  <p>{comment.text}</p>
                  <span>
                    {comment.meta} · {comment.likes + (isCommentLiked ? 1 : 0)} thích
                  </span>
                  <button type="button">Trả lời</button>
                </div>
                <button
                  className={isCommentLiked ? "is-liked" : ""}
                  type="button"
                  aria-label={isCommentLiked ? "Bỏ thích bình luận" : "Thích bình luận"}
                  onClick={() => onToggleLike(comment.id)}
                >
                  <Heart size={15} />
                </button>
              </article>
            );
          })}
        </div>

        <form className="post-comments__form" onSubmit={onSubmit}>
          <Avatar src={mockCurrentUser.avatarUrl} alt="" size="sm" />
          <input value={draft} placeholder="Thêm bình luận..." onChange={(event) => onDraftChange(event.target.value)} />
          <button type="submit" aria-label="Gửi bình luận">
            <Send size={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
