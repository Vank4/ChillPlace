import { Avatar } from "../../../components/common/Avatar.jsx";

export function StoryRail({ stories }) {
  return (
    <section className="story-rail" aria-label="Creator nổi bật">
      {stories.map((story) => (
        <button className="story-rail__item" key={story.id} type="button">
          <span className="story-rail__ring">
            <Avatar src={story.avatarUrl} alt={`Story của ${story.name}`} size="lg" />
          </span>
          <span>{story.name}</span>
        </button>
      ))}
    </section>
  );
}
