import { useMemo, useState } from "react";
import {
  CalendarClock,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  CreatorCenterHeader,
  CreatorCenterNav,
  CreatorStatCard
} from "../components/CreatorCenterNav.jsx";
import { getCreatorPostList } from "../../../services/creator.service.js";
import "./CreatorPages.css";

const statusLabels = {
  all: "Tất cả",
  published: "Đã đăng",
  scheduled: "Lên lịch"
};

export function CreatorPostsPage() {
  const posts = useMemo(() => getCreatorPostList(), []);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");

  const filteredPosts = useMemo(() => {
    const cleanKeyword = normalizeText(keyword);

    return posts.filter((post) => {
      const matchesStatus = status === "all" || post.status === status;
      const matchesKeyword = normalizeText(
        `${post.title} ${post.content} ${post.place?.name ?? ""} ${post.place?.area ?? ""}`
      ).includes(cleanKeyword);

      return matchesStatus && matchesKeyword;
    });
  }, [keyword, posts, status]);

  const totals = useMemo(() => {
    return posts.reduce(
      (result, post) => ({
        views: result.views + (post.metrics?.views ?? 0),
        likes: result.likes + (post.metrics?.likes ?? 0),
        comments: result.comments + (post.metrics?.comments ?? 0),
        shares: result.shares + (post.metrics?.shares ?? 0)
      }),
      { views: 0, likes: 0, comments: 0, shares: 0 }
    );
  }, [posts]);

  return (
    <main className="creator-page">
      <CreatorCenterHeader
        eyebrow="Creator Center"
        title="Bài viết của anh"
        description="Theo dõi các bài đã đăng, bài lên lịch và hiệu suất nhanh trong cùng một màn hình."
        action={
          <Link className="creator-center-action" to="/creator/posts/new">
            <Plus size={16} />
            Tạo bài mới
          </Link>
        }
      />

      <CreatorCenterNav />

      <section className="creator-stats-grid">
        <CreatorStatCard icon={Eye} label="Lượt xem" value={formatCompact(totals.views)} caption="+18%" />
        <CreatorStatCard icon={Heart} label="Lượt thích" value={formatCompact(totals.likes)} tone="green" />
        <CreatorStatCard icon={MessageCircle} label="Bình luận" value={formatCompact(totals.comments)} tone="blue" />
        <CreatorStatCard icon={Share2} label="Lượt chia sẻ" value={formatCompact(totals.shares)} />
      </section>

      <section className="creator-toolbar">
        <label>
          <Search size={16} />
          <input
            value={keyword}
            placeholder="Tìm bài viết, địa điểm, nội dung..."
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
        <div>
          <SlidersHorizontal size={15} />
          {Object.entries(statusLabels).map(([value, label]) => (
            <button
              className={status === value ? "is-active" : ""}
              key={value}
              type="button"
              onClick={() => setStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="creator-post-list" aria-label="Danh sách bài viết">
        {filteredPosts.map((post) => (
          <article className="creator-post-card" key={post.id}>
            <img src={post.imageUrl} alt="" loading="lazy" decoding="async" />
            <div className="creator-post-card__content">
              <div className="creator-post-card__topline">
                <span className={`creator-status creator-status--${post.status}`}>
                  {post.status === "scheduled" ? "Lên lịch" : "Đã đăng"}
                </span>
                <time dateTime={post.publishedAt ?? post.updatedAt}>
                  <CalendarClock size={13} />
                  {formatDate(post.publishedAt ?? post.updatedAt)}
                </time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <div className="creator-post-card__place">
                <strong>{post.place?.name ?? "ChillPlace"}</strong>
                <span>{post.place?.area ?? "Creator Center"}</span>
              </div>
              <div className="creator-post-card__tags">
                {(post.hashtags ?? []).slice(0, 3).map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
            <aside className="creator-post-card__metrics">
              <Metric icon={Eye} value={post.metrics?.views} label="Views" />
              <Metric icon={Heart} value={post.metrics?.likes} label="Likes" />
              <Metric icon={MessageCircle} value={post.metrics?.comments} label="Comments" />
              <Metric icon={TrendingUp} value={post.metrics?.saves} label="Saves" />
            </aside>
          </article>
        ))}
      </section>

      {filteredPosts.length === 0 ? (
        <section className="creator-empty-state">
          <Search size={30} />
          <h2>Không tìm thấy bài viết</h2>
          <p>Thử đổi từ khóa hoặc bộ lọc để xem lại danh sách bài đã tạo.</p>
        </section>
      ) : null}
    </main>
  );
}

function Metric({ icon: Icon, value = 0, label }) {
  return (
    <span>
      <Icon size={14} />
      <strong>{formatCompact(value)}</strong>
      <small>{label}</small>
    </span>
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

function formatDate(value) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

