import { mockFeedPosts, mockStories, mockTrendingTags } from "../../../data/mockFeed.js";
import { FeedItem } from "../components/FeedItem.jsx";
import { StoryRail } from "../components/StoryRail.jsx";
import { TrendingPanel } from "../components/TrendingPanel.jsx";
import "./HomeFeedPage.css";

export function HomeFeedPage() {
  return (
    <div className="home-feed-page">
      <section className="home-feed-page__main" aria-label="Feed dành cho bạn">
        <div className="home-feed-page__hero">
          <div>
            <span className="home-feed-page__eyebrow">Dành cho bạn</span>
            <h1>Khám phá vibe mới quanh thành phố</h1>
            <p>
              Feed thử nghiệm dùng mock data theo thiết kế Home Feed, sẵn sàng nối API
              `/api/feed` khi backend hoàn thiện.
            </p>
          </div>
          <div className="home-feed-page__tabs" role="tablist" aria-label="Bộ lọc feed">
            <button className="is-active" type="button">For You</button>
            <button type="button">Gần bạn</button>
            <button type="button">Đang hot</button>
          </div>
        </div>

        <StoryRail stories={mockStories} />

        <div className="home-feed-page__list">
          {mockFeedPosts.map((post) => (
            <FeedItem key={post.id} post={post} />
          ))}
        </div>
      </section>

      <TrendingPanel tags={mockTrendingTags} />
    </div>
  );
}
