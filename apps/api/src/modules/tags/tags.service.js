import { AppError } from "../../common/errors/AppError.js";
import {
  serializePlace,
  serializePost,
  serializeTag
} from "../discovery/discovery.serializer.js";
import {
  findTagBySlug,
  getTagContent,
  listRelatedTags,
  listTrendingTags,
  searchTags
} from "./tags.repository.js";

export async function getTrendingTags(limit) {
  return (await listTrendingTags(limit)).map(serializeTag);
}

export async function findTags(q, limit) {
  return (await searchTags(q, limit)).map(serializeTag);
}

export async function getTagDetail(slug) {
  const tag = await findTagBySlug(slug);
  if (!tag) throw AppError.notFound("Tag not found");
  const content = await getTagContent(tag.id);

  return {
    tag: serializeTag(tag),
    posts: content.posts.map(serializePost),
    places: content.places.map((place) => serializePlace(place))
  };
}

export async function getRelatedTags(slug, limit) {
  const tag = await findTagBySlug(slug);
  if (!tag) throw AppError.notFound("Tag not found");
  return (await listRelatedTags(tag.id, limit)).map((item) => ({
    ...serializeTag(item),
    relatedPostCount: item.relatedPostCount
  }));
}
