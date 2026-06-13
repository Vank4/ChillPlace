import { AppError } from "../../common/errors/AppError.js";
import {
  createCursor,
  createPagination
} from "../../common/utils/apiResponse.js";
import {
  decodeCursor,
  encodeCursor
} from "../../common/utils/discovery.js";
import { serializePost } from "../discovery/discovery.serializer.js";
import {
  findPublicPostById,
  listFeedPosts,
  searchPublicPosts
} from "./posts.repository.js";

export async function getFeed(query) {
  const cursorId = decodeCursor(query.cursor);
  if (query.cursor && !cursorId) {
    throw AppError.unprocessable("Invalid cursor", {
      cursor: "Cursor is invalid"
    });
  }

  const posts = await listFeedPosts({ ...query, cursorId });
  const hasMore = posts.length > query.limit;
  const items = posts.slice(0, query.limit);

  return {
    items: items.map(serializePost),
    cursor: createCursor({
      hasMore,
      nextCursor:
        hasMore && items.length > 0
          ? encodeCursor(items[items.length - 1].id)
          : null
    })
  };
}

export async function getPostDetail(id) {
  const post = await findPublicPostById(id);
  if (!post) throw AppError.notFound("Post not found");
  return serializePost(post);
}

export async function searchPosts(q, query) {
  const [posts, total] = await searchPublicPosts(q, query);
  return {
    items: posts.map(serializePost),
    pagination: createPagination({ ...query, total })
  };
}
