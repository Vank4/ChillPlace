import bcrypt from "bcrypt";
import { prisma } from "../common/utils/prisma.js";

const DEMO_PASSWORD = "ChillPlace@123";

async function upsertUser({ email, username, fullName, role }) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  return prisma.user.upsert({
    where: { email },
    update: { username, fullName, passwordHash, role, status: "active" },
    create: {
      email,
      username,
      fullName,
      passwordHash,
      role,
      status: "active"
    }
  });
}

async function findOrCreatePost(data) {
  const existing = await prisma.post.findFirst({
    where: { authorId: data.authorId, caption: data.caption }
  });
  return existing
    ? prisma.post.update({ where: { id: existing.id }, data })
    : prisma.post.create({ data });
}

async function ensurePlaceMedia(placeId, mediaUrl) {
  return (
    (await prisma.placeMedia.findFirst({ where: { placeId, mediaUrl } })) ??
    prisma.placeMedia.create({
      data: { placeId, mediaType: "image", mediaUrl }
    })
  );
}

async function ensurePostMedia(postId, mediaUrl) {
  return (
    (await prisma.postMedia.findFirst({ where: { postId, mediaUrl } })) ??
    prisma.postMedia.create({
      data: { postId, mediaType: "image", mediaUrl }
    })
  );
}

async function ensureComment(postId, userId, content) {
  return (
    (await prisma.comment.findFirst({ where: { postId, userId, content } })) ??
    prisma.comment.create({
      data: { postId, userId, content, status: "approved" }
    })
  );
}

export async function seedDatabase() {
  const [admin, user, creator, businessUser] = await Promise.all([
    upsertUser({
      email: "admin@chillplace.local",
      username: "chillplace_admin",
      fullName: "ChillPlace Admin",
      role: "admin"
    }),
    upsertUser({
      email: "user@chillplace.local",
      username: "chillplace_user",
      fullName: "ChillPlace User",
      role: "user"
    }),
    upsertUser({
      email: "creator@chillplace.local",
      username: "chillplace_creator",
      fullName: "ChillPlace Creator",
      role: "creator"
    }),
    upsertUser({
      email: "business@chillplace.local",
      username: "chillplace_business",
      fullName: "ChillPlace Business",
      role: "business"
    })
  ]);

  await prisma.creatorProfile.upsert({
    where: { userId: creator.id },
    update: {
      displayName: "Mika Local Guide",
      bio: "Khám phá những địa điểm đáng ghé tại TP.HCM.",
      socialLinks: { instagram: "https://instagram.com/chillplace" }
    },
    create: {
      userId: creator.id,
      displayName: "Mika Local Guide",
      bio: "Khám phá những địa điểm đáng ghé tại TP.HCM.",
      socialLinks: { instagram: "https://instagram.com/chillplace" }
    }
  });

  const business = await prisma.businessProfile.upsert({
    where: { userId: businessUser.id },
    update: {
      businessName: "Chill Corner Coffee",
      slug: "chill-corner-coffee",
      phone: "0901234567",
      address: "42 Nguyễn Huệ, Quận 1, TP.HCM",
      status: "approved",
      verifiedAt: new Date()
    },
    create: {
      userId: businessUser.id,
      businessName: "Chill Corner Coffee",
      slug: "chill-corner-coffee",
      phone: "0901234567",
      address: "42 Nguyễn Huệ, Quận 1, TP.HCM",
      status: "approved",
      verifiedAt: new Date()
    }
  });

  const categories = await Promise.all(
    [
      ["Cafe", "cafe", "coffee"],
      ["Ăn uống", "an-uong", "utensils"],
      ["Vui chơi", "vui-choi", "sparkles"]
    ].map(([name, slug, icon]) =>
      prisma.category.upsert({
        where: { slug },
        update: { name, icon, status: "active" },
        create: { name, slug, icon, status: "active" }
      })
    )
  );

  const [cafe, restaurant] = await Promise.all([
    prisma.place.upsert({
      where: { slug: "chill-corner-coffee" },
      update: {
        name: "Chill Corner Coffee",
        categoryId: categories[0].id,
        address: "42 Nguyễn Huệ",
        district: "Quận 1",
        city: "TP.HCM",
        lat: 10.7731,
        lng: 106.7032,
        priceMin: 35000,
        priceMax: 85000,
        openingHours: { daily: "07:00-22:30" },
        businessProfileId: business.id,
        status: "approved"
      },
      create: {
        name: "Chill Corner Coffee",
        slug: "chill-corner-coffee",
        categoryId: categories[0].id,
        address: "42 Nguyễn Huệ",
        district: "Quận 1",
        city: "TP.HCM",
        lat: 10.7731,
        lng: 106.7032,
        priceMin: 35000,
        priceMax: 85000,
        openingHours: { daily: "07:00-22:30" },
        businessProfileId: business.id,
        status: "approved"
      }
    }),
    prisma.place.upsert({
      where: { slug: "saigon-rooftop-kitchen" },
      update: {
        name: "Saigon Rooftop Kitchen",
        categoryId: categories[1].id,
        address: "18 Lê Thánh Tôn",
        district: "Quận 1",
        city: "TP.HCM",
        lat: 10.7802,
        lng: 106.7041,
        priceMin: 120000,
        priceMax: 350000,
        createdByUserId: creator.id,
        status: "approved"
      },
      create: {
        name: "Saigon Rooftop Kitchen",
        slug: "saigon-rooftop-kitchen",
        categoryId: categories[1].id,
        address: "18 Lê Thánh Tôn",
        district: "Quận 1",
        city: "TP.HCM",
        lat: 10.7802,
        lng: 106.7041,
        priceMin: 120000,
        priceMax: 350000,
        createdByUserId: creator.id,
        status: "approved"
      }
    })
  ]);

  await Promise.all([
    ensurePlaceMedia(
      cafe.id,
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
    ),
    ensurePlaceMedia(
      restaurant.id,
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f"
    )
  ]);

  const tags = await Promise.all(
    [
      ["Chill", "chill"],
      ["Cafe đẹp", "cafe-dep"],
      ["Hẹn hò", "hen-ho"],
      ["Sài Gòn", "sai-gon"]
    ].map(([name, slug]) =>
      prisma.tag.upsert({
        where: { slug },
        update: { name, status: "active" },
        create: { name, slug, status: "active" }
      })
    )
  );

  const [reviewPost, promotionPost] = await Promise.all([
    findOrCreatePost({
      authorId: creator.id,
      placeId: restaurant.id,
      postType: "review",
      caption:
        "[DEMO] Rooftop yên tĩnh giữa trung tâm, phù hợp cho buổi hẹn cuối tuần.",
      visibility: "public",
      status: "approved",
      viewCount: 1280,
      likeCount: 1,
      commentCount: 1,
      saveCount: 1
    }),
    findOrCreatePost({
      authorId: businessUser.id,
      placeId: cafe.id,
      postType: "promotion",
      caption: "[DEMO] Mua hai đồ uống tặng một bánh ngọt sau 18:00.",
      visibility: "public",
      status: "approved",
      viewCount: 860
    })
  ]);

  await Promise.all([
    ensurePostMedia(
      reviewPost.id,
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
    ),
    ensurePostMedia(
      promotionPost.id,
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
    )
  ]);

  await Promise.all(
    tags.map((tag) =>
      prisma.postTag.upsert({
        where: { postId_tagId: { postId: reviewPost.id, tagId: tag.id } },
        update: {},
        create: { postId: reviewPost.id, tagId: tag.id }
      })
    )
  );
  await prisma.postTag.upsert({
    where: {
      postId_tagId: { postId: promotionPost.id, tagId: tags[1].id }
    },
    update: {},
    create: { postId: promotionPost.id, tagId: tags[1].id }
  });

  await prisma.review.upsert({
    where: { userId_placeId: { userId: user.id, placeId: cafe.id } },
    update: {
      rating: 5,
      content: "Không gian thoáng, nhân viên thân thiện.",
      status: "approved"
    },
    create: {
      userId: user.id,
      placeId: cafe.id,
      rating: 5,
      content: "Không gian thoáng, nhân viên thân thiện.",
      status: "approved"
    }
  });
  await ensureComment(
    reviewPost.id,
    user.id,
    "Đã lưu lại để cuối tuần ghé thử."
  );

  await Promise.all([
    prisma.like.upsert({
      where: {
        userId_targetType_targetId: {
          userId: user.id,
          targetType: "post",
          targetId: reviewPost.id
        }
      },
      update: {},
      create: {
        userId: user.id,
        targetType: "post",
        targetId: reviewPost.id
      }
    }),
    prisma.favorite.upsert({
      where: { userId_placeId: { userId: user.id, placeId: cafe.id } },
      update: {},
      create: { userId: user.id, placeId: cafe.id }
    }),
    prisma.savedPost.upsert({
      where: { userId_postId: { userId: user.id, postId: reviewPost.id } },
      update: {},
      create: { userId: user.id, postId: reviewPost.id }
    }),
    prisma.follow.upsert({
      where: {
        followerId_followingUserId: {
          followerId: user.id,
          followingUserId: creator.id
        }
      },
      update: {},
      create: { followerId: user.id, followingUserId: creator.id }
    })
  ]);

  const validTo = new Date();
  validTo.setDate(validTo.getDate() + 30);
  await prisma.promotion.upsert({
    where: { postId: promotionPost.id },
    update: {
      businessProfileId: business.id,
      title: "Combo buổi tối",
      description: "Ưu đãi demo cho giao diện Business Center.",
      discountText: "Mua 2 tặng 1 bánh",
      validFrom: new Date(),
      validTo,
      status: "active"
    },
    create: {
      postId: promotionPost.id,
      businessProfileId: business.id,
      title: "Combo buổi tối",
      description: "Ưu đãi demo cho giao diện Business Center.",
      discountText: "Mua 2 tặng 1 bánh",
      validFrom: new Date(),
      validTo,
      status: "active"
    }
  });

  await Promise.all(
    tags.map(async (tag) =>
      prisma.tag.update({
        where: { id: tag.id },
        data: {
          usageCount: await prisma.postTag.count({ where: { tagId: tag.id } })
        }
      })
    )
  );
  await prisma.place.update({
    where: { id: cafe.id },
    data: { ratingAvg: 5, ratingCount: 1 }
  });

  return {
    password: DEMO_PASSWORD,
    accounts: [admin, user, creator, businessUser].map(
      ({ email, username, role }) => ({ email, username, role })
    ),
    counts: { categories: 3, places: 2, posts: 2, tags: 4 }
  };
}
