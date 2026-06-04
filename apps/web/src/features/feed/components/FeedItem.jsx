import { MapPin, MoreHorizontal, Star, TrendingUp } from "lucide-react";
import { Avatar } from "../../../components/common/Avatar.jsx";
import { Button } from "../../../components/common/Button.jsx";
import { TagChip } from "../../../components/common/TagChip.jsx";
import { FeedActionRail } from "./FeedActionRail.jsx";

export function FeedItem({ post }) {
  return (
    <article className="feed-item">
      <div className="feed-item__header">
        <div className="feed-item__author">
          <Avatar src={post.author.avatarUrl} alt={`Ảnh đại diện ${post.author.name}`} size="sm" />
          <div>
            <strong>{post.author.name}</strong>
            <span>@{post.author.username} · {post.createdAt}</span>
          </div>
        </div>
        <button className="feed-item__more" type="button" aria-label="Tùy chọn bài viết">
          <MoreHorizontal size={22} aria-hidden="true" />
        </button>
      </div>

      <div className="feed-item__media">
        <img src={post.mediaUrl} alt={post.alt} loading="lazy" decoding="async" />
        <div className="feed-item__scrim" />

        <div className="feed-item__media-badges">
          {post.isTrending ? (
            <span className="feed-item__badge feed-item__badge--hot">
              <TrendingUp size={14} aria-hidden="true" />
              Thịnh hành
            </span>
          ) : null}
          <span className="feed-item__badge feed-item__badge--place">
            <MapPin size={14} aria-hidden="true" />
            {post.place.name}
          </span>
        </div>

        <FeedActionRail stats={post.stats} />
      </div>

      <div className="feed-item__body">
        <div className="feed-item__place-row">
          <div>
            <h2>{post.place.name}</h2>
            <p>{post.place.area} · {post.place.distance}</p>
          </div>
          <span className="feed-item__rating">
            <Star size={15} aria-hidden="true" />
            {post.place.rating}
          </span>
        </div>

        <p className="feed-item__caption">{post.caption}</p>

        <div className="feed-item__tags">
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <div className="feed-item__footer">
          <Button variant="ghost">Xem địa điểm</Button>
          <Button>Chỉ đường</Button>
        </div>
      </div>
    </article>
  );
}
