import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";

const actions = [
  { key: "likes", label: "Thích", icon: Heart, active: true },
  { key: "comments", label: "Bình luận", icon: MessageCircle },
  { key: "saves", label: "Lưu", icon: Bookmark },
  { key: "shares", label: "Chia sẻ", icon: Send }
];

export function FeedActionRail({ stats }) {
  return (
    <div className="feed-actions" aria-label="Tương tác bài viết">
      {actions.map((action) => (
        <button
          className={action.active ? "feed-actions__button is-active" : "feed-actions__button"}
          key={action.key}
          type="button"
          aria-label={action.label}
        >
          <action.icon size={20} aria-hidden="true" />
          <span>{stats[action.key]}</span>
        </button>
      ))}
    </div>
  );
}
