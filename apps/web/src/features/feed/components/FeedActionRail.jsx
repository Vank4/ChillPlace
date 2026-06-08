import { useState } from "react";
import { Heart, MapPin, MessageCircle, MoreHorizontal, Plus, Send } from "lucide-react";
import { Avatar } from "../../../components/common/Avatar.jsx";

const actions = [
  { key: "likes", label: "Thích", icon: Heart },
  { key: "comments", label: "Bình luận", icon: MessageCircle },
  { key: "place", label: "Xem địa điểm", icon: MapPin },
  { key: "shares", label: "Chia sẻ", icon: Send },
  { key: "more", label: "Thêm tuỳ chọn", icon: MoreHorizontal }
];

export function FeedActionRail({ author, stats, isCommentsOpen = false, onToggleComments }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeActions, setActiveActions] = useState(() => new Set());

  function toggleAction(actionKey) {
    setActiveActions((currentActions) => {
      const nextActions = new Set(currentActions);

      if (nextActions.has(actionKey)) {
        nextActions.delete(actionKey);
      } else {
        nextActions.add(actionKey);
      }

      return nextActions;
    });
  }

  return (
    <div className="feed-actions" aria-label="Tương tác bài viết">
      <button
        className={isFollowing ? "feed-actions__profile is-following" : "feed-actions__profile"}
        type="button"
        aria-label={isFollowing ? `Đã theo dõi ${author.name}` : `Theo dõi ${author.name}`}
        aria-pressed={isFollowing}
        onClick={() => setIsFollowing((currentValue) => !currentValue)}
      >
        <Avatar src={author.avatarUrl} alt={`Ảnh đại diện ${author.name}`} size="lg" />
        <span aria-hidden="true">
          <Plus size={13} />
        </span>
      </button>

      {actions.map((action) => {
        const isLiked = action.key === "likes" ? activeActions.has(action.key) : false;
        const isCommentActive = action.key === "comments" && isCommentsOpen;

        return (
          <button
            className={[
              "feed-actions__button",
              isLiked ? "is-liked" : "",
              isCommentActive ? "is-active" : ""
            ].filter(Boolean).join(" ")}
            key={action.key}
            type="button"
            aria-label={action.label}
            aria-pressed={action.key === "likes" ? isLiked : action.key === "comments" ? isCommentsOpen : undefined}
            onClick={() => {
              if (action.key === "likes") {
                toggleAction(action.key);
              }

              if (action.key === "comments") {
                onToggleComments?.();
              }
            }}
          >
            <action.icon size={20} aria-hidden="true" />
            {action.key === "place" ? <span>Vị trí</span> : null}
            {action.key !== "place" && action.key !== "more" ? <span>{stats[action.key]}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
