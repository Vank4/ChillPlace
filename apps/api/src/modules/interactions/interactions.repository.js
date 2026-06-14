import { prisma } from "../../common/utils/prisma.js";
import { placeCardInclude } from "../places/places.repository.js";
import { publicPostInclude } from "../posts/posts.repository.js";

export function findPublicPost(id) {
  return prisma.post.findFirst({
    where: {
      id,
      status: "approved",
      visibility: "public",
      author: { status: "active" }
    },
    select: { id: true, authorId: true }
  });
}

export function findPublicPlace(id) {
  return prisma.place.findFirst({
    where: { id, status: "approved" },
    select: {
      id: true,
      business: { select: { userId: true, status: true } }
    }
  });
}

export async function togglePostLike(userId, postId, authorId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: "post",
          targetId: postId
        }
      }
    });

    if (existing) {
      await tx.like.delete({ where: { id: existing.id } });
    } else {
      await tx.like.create({
        data: { userId, targetType: "post", targetId: postId }
      });
      if (authorId !== userId) {
        await tx.notification.create({
          data: {
            userId: authorId,
            type: "post_like",
            title: "Bài viết của bạn có lượt thích mới",
            dataJson: { postId, actorId: userId }
          }
        });
      }
    }

    const likeCount = await tx.like.count({
      where: { targetType: "post", targetId: postId }
    });
    await tx.post.update({
      where: { id: postId },
      data: { likeCount }
    });

    return { liked: !existing, likeCount };
  });
}

export async function togglePostSave(userId, postId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.savedPost.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await tx.savedPost.delete({ where: { id: existing.id } });
    } else {
      await tx.savedPost.create({ data: { userId, postId } });
    }

    const saveCount = await tx.savedPost.count({ where: { postId } });
    await tx.post.update({
      where: { id: postId },
      data: { saveCount }
    });

    return { saved: !existing, saveCount };
  });
}

export async function togglePlaceFavorite(userId, placeId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.favorite.findUnique({
      where: { userId_placeId: { userId, placeId } }
    });
    if (existing) {
      await tx.favorite.delete({ where: { id: existing.id } });
    } else {
      await tx.favorite.create({ data: { userId, placeId } });
    }
    const favoriteCount = await tx.favorite.count({ where: { placeId } });
    return { favorited: !existing, favoriteCount };
  });
}

export function listFavorites(userId, { page, limit }) {
  const where = { userId, place: { status: "approved" } };
  return prisma.$transaction([
    prisma.favorite.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { place: { include: placeCardInclude } }
    }),
    prisma.favorite.count({ where })
  ]);
}

export function listSavedPosts(userId, { page, limit }) {
  const where = {
    userId,
    post: {
      status: "approved",
      visibility: "public",
      author: { status: "active" }
    }
  };
  return prisma.$transaction([
    prisma.savedPost.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: { post: { include: publicPostInclude } }
    }),
    prisma.savedPost.count({ where })
  ]);
}

export function listComments(postId, { page, limit }) {
  const where = {
    postId,
    parentId: null,
    status: "approved",
    user: { status: "active" }
  };
  return prisma.$transaction([
    prisma.comment.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        },
        replies: {
          where: { status: "approved", user: { status: "active" } },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    }),
    prisma.comment.count({ where })
  ]);
}

export function findApprovedComment(id) {
  return prisma.comment.findFirst({
    where: { id, status: "approved" },
    select: { id: true, postId: true, userId: true, parentId: true }
  });
}

export function findReviewByUserAndPlace(userId, placeId) {
  return prisma.review.findUnique({
    where: { userId_placeId: { userId, placeId } },
    select: { id: true }
  });
}

export async function createComment(input) {
  return prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        postId: input.postId,
        userId: input.userId,
        parentId: input.parentId ?? null,
        content: input.content,
        status: "approved"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });
    const commentCount = await tx.comment.count({
      where: { postId: input.postId, status: "approved" }
    });
    await tx.post.update({
      where: { id: input.postId },
      data: { commentCount }
    });
    if (input.notifyUserId && input.notifyUserId !== input.userId) {
      await tx.notification.create({
        data: {
          userId: input.notifyUserId,
          type: input.parentId ? "comment_reply" : "post_comment",
          title: input.parentId
            ? "Bình luận của bạn có phản hồi mới"
            : "Bài viết của bạn có bình luận mới",
          dataJson: {
            postId: input.postId,
            commentId: comment.id,
            actorId: input.userId
          }
        }
      });
    }
    return { comment, commentCount };
  });
}

async function refreshPlaceRating(tx, placeId) {
  const aggregate = await tx.review.aggregate({
    where: { placeId, status: "approved" },
    _avg: { rating: true },
    _count: { rating: true }
  });
  const ratingAvg = aggregate._avg.rating ?? 0;
  const ratingCount = aggregate._count.rating;
  await tx.place.update({
    where: { id: placeId },
    data: { ratingAvg, ratingCount }
  });
  return { ratingAvg: Number(ratingAvg), ratingCount };
}

export async function createPlaceReview(input) {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        userId: input.userId,
        placeId: input.placeId,
        rating: input.rating,
        content: input.content,
        status: "approved"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });
    const rating = await refreshPlaceRating(tx, input.placeId);
    if (input.notifyUserId && input.notifyUserId !== input.userId) {
      await tx.notification.create({
        data: {
          userId: input.notifyUserId,
          type: "place_review",
          title: "Địa điểm của bạn có đánh giá mới",
          dataJson: {
            placeId: input.placeId,
            reviewId: review.id,
            actorId: input.userId
          }
        }
      });
    }
    return { review, ...rating };
  });
}

export function findReviewForUpdate(id) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true
        }
      },
      place: {
        select: {
          id: true,
          status: true,
          business: { select: { userId: true, status: true } }
        }
      },
      reply: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              avatarUrl: true,
              role: true
            }
          }
        }
      }
    }
  });
}

export async function updatePlaceReview(id, data) {
  return prisma.$transaction(async (tx) => {
    const review = await tx.review.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true
          }
        }
      }
    });
    const rating = await refreshPlaceRating(tx, review.placeId);
    return { review, ...rating };
  });
}

export async function createReviewReply(input) {
  return prisma.$transaction(async (tx) => {
    const reply = await tx.reviewReply.create({
      data: {
        reviewId: input.reviewId,
        userId: input.userId,
        content: input.content,
        status: "approved"
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            role: true
          }
        }
      }
    });
    if (input.notifyUserId !== input.userId) {
      await tx.notification.create({
        data: {
          userId: input.notifyUserId,
          type: "review_reply",
          title: "Đánh giá của bạn có phản hồi",
          dataJson: {
            reviewId: input.reviewId,
            replyId: reply.id,
            actorId: input.userId
          }
        }
      });
    }
    return reply;
  });
}

export function findRecentReport(reporterId, targetType, targetId, since) {
  return prisma.report.findFirst({
    where: {
      reporterId,
      targetType,
      targetId,
      status: "pending",
      createdAt: { gte: since }
    }
  });
}

export function createReport(data) {
  return prisma.report.create({ data });
}

export async function reportTargetExists(targetType, targetId) {
  const checks = {
    post: () =>
      prisma.post.count({
        where: { id: targetId, status: "approved", visibility: "public" }
      }),
    comment: () =>
      prisma.comment.count({
        where: {
          id: targetId,
          status: "approved",
          post: { status: "approved", visibility: "public" }
        }
      }),
    review: () =>
      prisma.review.count({
        where: {
          id: targetId,
          status: "approved",
          place: { status: "approved" }
        }
      }),
    place: () =>
      prisma.place.count({ where: { id: targetId, status: "approved" } }),
    user: () =>
      prisma.user.count({ where: { id: targetId, status: "active" } }),
    tag: () => prisma.tag.count({ where: { id: targetId, status: "active" } })
  };
  return (await checks[targetType]()) > 0;
}
