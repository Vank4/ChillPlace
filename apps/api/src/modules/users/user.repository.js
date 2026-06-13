import { prisma } from "../../common/utils/prisma.js";

const currentUserSelect = {
  id: true,
  username: true,
  fullName: true,
  email: true,
  passwordHash: true,
  phone: true,
  avatarUrl: true,
  coverUrl: true,
  bio: true,
  location: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true
};

export function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: currentUserSelect
  });
}

export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
    select: currentUserSelect
  });
}

export function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
    select: currentUserSelect
  });
}

export function createUser(data) {
  return prisma.user.create({
    data,
    select: currentUserSelect
  });
}

export function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: currentUserSelect
  });
}

export function findPublicProfile(username) {
  return prisma.user.findFirst({
    where: {
      username,
      status: "active"
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatarUrl: true,
      coverUrl: true,
      bio: true,
      location: true,
      role: true,
      creatorProfile: {
        select: {
          displayName: true,
          bio: true,
          socialLinks: true
        }
      },
      _count: {
        select: {
          posts: {
            where: {
              status: "approved",
              visibility: "public"
            }
          },
          followers: true,
          following: true
        }
      }
    }
  });
}

export function listPublicPostsByUser(userId, { page, limit }) {
  return prisma.$transaction([
    prisma.post.findMany({
      where: {
        authorId: userId,
        status: "approved",
        visibility: "public"
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        media: { orderBy: { sortOrder: "asc" } },
        place: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        status: "approved",
        visibility: "public"
      }
    })
  ]);
}

export function findFollow(followerId, followingUserId) {
  return prisma.follow.findUnique({
    where: {
      followerId_followingUserId: {
        followerId,
        followingUserId
      }
    }
  });
}

export async function toggleFollow(followerId, followingUserId) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.follow.findUnique({
      where: {
        followerId_followingUserId: {
          followerId,
          followingUserId
        }
      }
    });

    if (existing) {
      await tx.follow.delete({ where: { id: existing.id } });
    } else {
      await tx.follow.create({
        data: { followerId, followingUserId }
      });
      await tx.notification.create({
        data: {
          userId: followingUserId,
          type: "new_follower",
          title: "Bạn có người theo dõi mới",
          dataJson: { followerId }
        }
      });
    }

    const followerCount = await tx.follow.count({
      where: { followingUserId }
    });

    return {
      following: !existing,
      followerCount
    };
  });
}
