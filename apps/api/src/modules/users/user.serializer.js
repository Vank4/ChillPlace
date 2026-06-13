export function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    bio: user.bio,
    location: user.location,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function serializePublicUser(user, viewer = {}) {
  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl,
    coverUrl: user.coverUrl,
    bio: user.bio,
    location: user.location,
    role: user.role,
    creatorProfile: user.creatorProfile
      ? {
          displayName: user.creatorProfile.displayName,
          bio: user.creatorProfile.bio,
          socialLinks: user.creatorProfile.socialLinks
        }
      : null,
    stats: {
      posts: user._count.posts,
      followers: user._count.followers,
      following: user._count.following
    },
    isFollowing: Boolean(viewer.isFollowing)
  };
}
