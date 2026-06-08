import { useState } from "react";
import { MapPin, Star, TrendingUp } from "lucide-react";
import { FeedActionRail } from "./FeedActionRail.jsx";

const supportedRatios = new Set(["portrait", "landscape", "square"]);
const fallbackAspectRatios = {
  portrait: "9 / 16",
  square: "1 / 1",
  landscape: "16 / 9"
};

const fallbackMediaWidths = {
  portrait: "min(430px, calc(var(--feed-media-available-height) * 9 / 16))",
  square: "min(560px, var(--feed-media-available-height))",
  landscape: "min(760px, calc(var(--feed-media-available-height) * 16 / 9))"
};

function getMediaOrientation(width, height) {
  if (!width || !height) {
    return null;
  }

  const ratio = width / height;

  if (ratio > 1.12) {
    return "landscape";
  }

  if (ratio < 0.88) {
    return "portrait";
  }

  return "square";
}

function getMediaWidthRule(width, height, orientation) {
  const ratio = width / height;
  const maxWidth = {
    portrait: "430px",
    square: "560px",
    landscape: "760px"
  }[orientation];

  if (orientation === "square") {
    return `min(${maxWidth}, var(--feed-media-available-height))`;
  }

  return `min(${maxWidth}, calc(var(--feed-media-available-height) * ${ratio.toFixed(4)}))`;
}

export function FeedItem({ post, isCommentsOpen = false, onToggleComments }) {
  const fallbackRatio = supportedRatios.has(post.mediaRatio) ? post.mediaRatio : "portrait";
  const [measuredMedia, setMeasuredMedia] = useState(null);
  const mediaRatio = measuredMedia?.orientation ?? fallbackRatio;
  const mediaStyle = {
    "--feed-media-ratio": measuredMedia?.aspectRatio ?? fallbackAspectRatios[fallbackRatio],
    "--feed-media-width": measuredMedia?.widthRule ?? fallbackMediaWidths[fallbackRatio]
  };

  function handleImageLoad(event) {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const orientation = getMediaOrientation(naturalWidth, naturalHeight);

    if (!orientation) {
      return;
    }

    setMeasuredMedia({
      orientation,
      aspectRatio: `${naturalWidth} / ${naturalHeight}`,
      widthRule: getMediaWidthRule(naturalWidth, naturalHeight, orientation)
    });
  }

  return (
    <article className={`feed-item feed-item--${mediaRatio}`}>
      <div className="feed-item__stage">
        <div className="feed-item__media" style={mediaStyle}>
          <img
            src={post.mediaUrl}
            alt={post.alt}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
          />
          <div className="feed-item__scrim" />

          <div className="feed-item__overlay">
            <div className="feed-item__author">
              <strong>{post.author.name}</strong>
              <span>@{post.author.username} · {post.createdAt}</span>
            </div>

            <div className="feed-item__place-row">
              <div>
                <h2>{post.place.name}</h2>
                <p>{post.place.area} · {post.place.distance}</p>
              </div>
              <span className="feed-item__rating">
                <Star size={13} aria-hidden="true" />
                {post.place.rating}
              </span>
            </div>

            <p className="feed-item__caption">{post.caption}</p>

            <div className="feed-item__meta-pills">
              {post.isTrending ? (
                <span>
                  <TrendingUp size={12} aria-hidden="true" />
                  Thịnh hành
                </span>
              ) : null}
              <span>
                <MapPin size={12} aria-hidden="true" />
                {post.place.area} · {post.place.distance}
              </span>
            </div>
          </div>
        </div>

        <FeedActionRail
          author={post.author}
          stats={post.stats}
          isCommentsOpen={isCommentsOpen}
          onToggleComments={onToggleComments}
        />
      </div>
    </article>
  );
}
