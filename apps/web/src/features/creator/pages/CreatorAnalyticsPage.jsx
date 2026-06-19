import { useMemo } from "react";
import {
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  CreatorCenterHeader,
  CreatorCenterNav,
  CreatorStatCard
} from "../components/CreatorCenterNav.jsx";
import { getCreatorPostList } from "../../../services/creator.service.js";
import "./CreatorPages.css";

export function CreatorAnalyticsPage() {
  const posts = useMemo(() => getCreatorPostList(), []);
  const publishedPosts = posts.filter((post) => post.status !== "scheduled");

  const totals = useMemo(() => {
    return publishedPosts.reduce(
      (result, post) => ({
        views: result.views + (post.metrics?.views ?? 0),
        likes: result.likes + (post.metrics?.likes ?? 0),
        comments: result.comments + (post.metrics?.comments ?? 0),
        saves: result.saves + (post.metrics?.saves ?? 0),
        shares: result.shares + (post.metrics?.shares ?? 0)
      }),
      { views: 0, likes: 0, comments: 0, saves: 0, shares: 0 }
    );
  }, [publishedPosts]);

  const engagementRate = totals.views
    ? Math.round(((totals.likes + totals.comments + totals.saves + totals.shares) / totals.views) * 1000) / 10
    : 0;

  const topPosts = [...publishedPosts]
    .sort((a, b) => (b.metrics?.views ?? 0) - (a.metrics?.views ?? 0))
    .slice(0, 3);
  const maxViews = Math.max(...topPosts.map((post) => post.metrics?.views ?? 0), 1);

  const weeklyData = [
    { day: "T2", value: 34 },
    { day: "T3", value: 46 },
    { day: "T4", value: 38 },
    { day: "T5", value: 59 },
    { day: "T6", value: 72 },
    { day: "T7", value: 94 },
    { day: "CN", value: 81 }
  ];

  return (
    <main className="creator-page">
      <CreatorCenterHeader
        eyebrow="Creator Analytics"
        title="Tín hiệu tăng trưởng"
        description="Một bảng nhìn nhanh cho lượt xem, tương tác và bài viết đang kéo người xem tốt nhất."
        action={
          <Link className="creator-center-action" to="/creator/posts">
            <BarChart3 size={16} />
            Xem bài viết
          </Link>
        }
      />

      <CreatorCenterNav />

      <section className="creator-stats-grid">
        <CreatorStatCard icon={Eye} label="Lượt xem" value={formatCompact(totals.views)} caption="+18%" />
        <CreatorStatCard icon={Users} label="Tệp tiếp cận" value={formatCompact(Math.round(totals.views * 0.62))} tone="blue" />
        <CreatorStatCard icon={Heart} label="Tương tác" value={`${engagementRate}%`} tone="green" />
        <CreatorStatCard icon={Share2} label="Chia sẻ" value={formatCompact(totals.shares)} />
      </section>

      <section className="creator-analytics-layout">
        <article className="creator-panel creator-chart-panel">
          <header>
            <div>
              <span>7 ngày gần nhất</span>
              <h2>Lượt xem theo ngày</h2>
            </div>
            <strong>+24%</strong>
          </header>
          <div className="creator-week-chart" aria-label="Biểu đồ lượt xem trong tuần">
            {weeklyData.map((item) => (
              <span key={item.day}>
                <i style={{ height: `${item.value}%` }} />
                <small>{item.day}</small>
              </span>
            ))}
          </div>
        </article>

        <article className="creator-panel creator-insight-panel">
          <header>
            <div>
              <span>Gợi ý</span>
              <h2>Điểm nên tối ưu</h2>
            </div>
            <Sparkles size={18} />
          </header>
          <ul>
            <li>
              <TrendingUp size={15} />
              Bài có ảnh ngang đang giữ chân người xem tốt hơn 31%.
            </li>
            <li>
              <MessageCircle size={15} />
              Caption có câu hỏi cuối bài tạo nhiều bình luận hơn.
            </li>
            <li>
              <Heart size={15} />
              Khung đăng hiệu quả nhất: 19:00 - 21:00.
            </li>
          </ul>
        </article>
      </section>

      <section className="creator-panel creator-top-posts">
        <header>
          <div>
            <span>Top content</span>
            <h2>Bài viết nổi bật</h2>
          </div>
          <Link to="/creator/posts">Quản lý tất cả</Link>
        </header>

        <div>
          {topPosts.map((post) => (
            <article key={post.id}>
              <img src={post.imageUrl} alt="" />
              <div>
                <h3>{post.title}</h3>
                <p>{post.place?.area ?? "Creator Center"}</p>
                <span>
                  <i style={{ width: `${((post.metrics?.views ?? 0) / maxViews) * 100}%` }} />
                </span>
              </div>
              <strong>{formatCompact(post.metrics?.views ?? 0)}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function formatCompact(value = 0) {
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

