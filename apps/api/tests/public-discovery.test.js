import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  return { response, body };
}

test("public discovery API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const slug = `discovery-cafe-${suffix}`;
  const hiddenSlug = `hidden-cafe-${suffix}`;
  const categorySlug = `coffee-${suffix}`;
  const tagSlug = `chill-${suffix}`;
  const relatedTagSlug = `weekend-${suffix}`;

  const user = await prisma.user.create({
    data: {
      username: `discovery_${suffix}`,
      fullName: "Discovery Creator",
      email: `discovery_${suffix}@chillplace.test`,
      passwordHash: "test-only-hash",
      role: "creator",
      status: "active"
    }
  });
  const business = await prisma.businessProfile.create({
    data: {
      userId: user.id,
      businessName: `Discovery Business ${suffix}`,
      status: "approved"
    }
  });
  const category = await prisma.category.create({
    data: {
      name: `Coffee ${suffix}`,
      slug: categorySlug,
      status: "active"
    }
  });
  const place = await prisma.place.create({
    data: {
      name: `Discovery Cafe ${suffix}`,
      slug,
      categoryId: category.id,
      address: "1 Nguyen Hue",
      district: "District 1",
      city: "Ho Chi Minh City",
      lat: 10.7769,
      lng: 106.7009,
      openingHours: { daily: "00:00-23:59" },
      ratingAvg: 4.8,
      ratingCount: 25,
      status: "approved",
      createdByUserId: user.id,
      businessProfileId: business.id,
      media: {
        create: {
          mediaType: "image",
          mediaUrl: `https://example.com/${slug}.jpg`
        }
      }
    }
  });
  const hiddenPlace = await prisma.place.create({
    data: {
      name: `Hidden Cafe ${suffix}`,
      slug: hiddenSlug,
      categoryId: category.id,
      city: "Ho Chi Minh City",
      status: "pending",
      createdByUserId: user.id
    }
  });
  const tag = await prisma.tag.create({
    data: {
      name: `Chill ${suffix}`,
      slug: tagSlug,
      usageCount: 30,
      status: "active"
    }
  });
  const relatedTag = await prisma.tag.create({
    data: {
      name: `Weekend ${suffix}`,
      slug: relatedTagSlug,
      usageCount: 12,
      status: "active"
    }
  });
  const firstPost = await prisma.post.create({
    data: {
      authorId: user.id,
      placeId: place.id,
      postType: "review",
      caption: `A public discovery review ${suffix}`,
      status: "approved",
      visibility: "public",
      likeCount: 8,
      media: {
        create: {
          mediaType: "image",
          mediaUrl: `https://example.com/post-${suffix}.jpg`
        }
      },
      tags: {
        create: [{ tagId: tag.id }, { tagId: relatedTag.id }]
      }
    }
  });
  const promotionPost = await prisma.post.create({
    data: {
      authorId: user.id,
      placeId: place.id,
      postType: "promotion",
      caption: `Promotion discovery ${suffix}`,
      status: "approved",
      visibility: "public"
    }
  });
  await prisma.promotion.create({
    data: {
      postId: promotionPost.id,
      businessProfileId: business.id,
      title: `Happy Hour ${suffix}`,
      discountText: "20%",
      validFrom: new Date(Date.now() - 86400000),
      validTo: new Date(Date.now() + 86400000),
      status: "active"
    }
  });
  const hiddenPost = await prisma.post.create({
    data: {
      authorId: user.id,
      placeId: place.id,
      postType: "review",
      caption: `Hidden discovery post ${suffix}`,
      status: "hidden",
      visibility: "public"
    }
  });
  await prisma.review.create({
    data: {
      userId: user.id,
      placeId: place.id,
      rating: 5,
      content: `Great discovery place ${suffix}`,
      status: "approved"
    }
  });

  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.post.deleteMany({
        where: { id: { in: [firstPost.id, promotionPost.id, hiddenPost.id] } }
      });
      await prisma.place.deleteMany({
        where: { id: { in: [place.id, hiddenPlace.id] } }
      });
      await prisma.tag.deleteMany({
        where: { id: { in: [tag.id, relatedTag.id] } }
      });
      await prisma.category.delete({ where: { id: category.id } });
      await prisma.businessProfile.delete({ where: { id: business.id } });
      await prisma.user.delete({ where: { id: user.id } });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const categories = await request(baseUrl, "/api/categories");
  assert.equal(categories.response.status, 200);
  assert.ok(categories.body.data.items.some((item) => item.id === category.id));

  const places = await request(
    baseUrl,
    `/api/places?q=${encodeURIComponent(`Discovery Cafe ${suffix}`)}`
  );
  assert.equal(places.response.status, 200);
  assert.equal(places.body.data.items.length, 1);
  assert.equal(places.body.data.items[0].slug, slug);

  const nearby = await request(
    baseUrl,
    `/api/places/nearby?lat=10.7769&lng=106.7009&radius=1`
  );
  assert.equal(nearby.response.status, 200);
  assert.ok(nearby.body.data.items.some((item) => item.id === place.id));
  assert.equal(typeof nearby.body.data.items[0].distanceKm, "number");

  const map = await request(
    baseUrl,
    "/api/map/places?north=10.8&south=10.7&east=106.8&west=106.6"
  );
  assert.equal(map.response.status, 200);
  assert.ok(map.body.data.items.some((item) => item.id === place.id));
  assert.ok(!map.body.data.items.some((item) => item.id === hiddenPlace.id));

  const detail = await request(baseUrl, `/api/places/${slug}`);
  assert.equal(detail.response.status, 200);
  assert.equal(detail.body.data.place.id, place.id);
  assert.equal(detail.body.data.place.stats.reviewCount, 1);

  const hiddenDetail = await request(baseUrl, `/api/places/${hiddenSlug}`);
  assert.equal(hiddenDetail.response.status, 404);

  const reviews = await request(
    baseUrl,
    `/api/places/${place.id}/reviews`
  );
  assert.equal(reviews.response.status, 200);
  assert.equal(reviews.body.data.items.length, 1);

  const promotions = await request(
    baseUrl,
    `/api/places/${place.id}/promotions`
  );
  assert.equal(promotions.response.status, 200);
  assert.equal(promotions.body.data.items.length, 1);

  const relatedPosts = await request(
    baseUrl,
    `/api/places/${place.id}/related-posts`
  );
  assert.equal(relatedPosts.response.status, 200);
  assert.equal(relatedPosts.body.pagination.total, 2);
  assert.ok(
    !relatedPosts.body.data.items.some((item) => item.id === hiddenPost.id)
  );

  const feed = await request(baseUrl, "/api/feed?limit=1");
  assert.equal(feed.response.status, 200);
  assert.equal(feed.body.data.items.length, 1);
  assert.equal(feed.body.cursor.has_more, true);
  assert.equal(typeof feed.body.cursor.next_cursor, "string");

  const secondFeed = await request(
    baseUrl,
    `/api/feed?limit=10&cursor=${feed.body.cursor.next_cursor}`
  );
  assert.equal(secondFeed.response.status, 200);
  assert.ok(
    !secondFeed.body.data.items.some(
      (item) => item.id === feed.body.data.items[0].id
    )
  );

  const postDetail = await request(baseUrl, `/api/posts/${firstPost.id}`);
  assert.equal(postDetail.response.status, 200);
  assert.equal(postDetail.body.data.post.tags.length, 2);

  const hiddenPostDetail = await request(
    baseUrl,
    `/api/posts/${hiddenPost.id}`
  );
  assert.equal(hiddenPostDetail.response.status, 404);

  const search = await request(
    baseUrl,
    `/api/search?q=${encodeURIComponent(suffix)}`
  );
  assert.equal(search.response.status, 200);
  assert.ok(search.body.data.places.items.some((item) => item.id === place.id));
  assert.ok(search.body.data.posts.items.some((item) => item.id === firstPost.id));

  const trending = await request(baseUrl, "/api/tags/trending?limit=50");
  assert.equal(trending.response.status, 200);
  assert.ok(trending.body.data.items.some((item) => item.id === tag.id));

  const tagSearch = await request(
    baseUrl,
    `/api/tags/search?q=${encodeURIComponent(suffix)}`
  );
  assert.equal(tagSearch.response.status, 200);
  assert.ok(tagSearch.body.data.items.some((item) => item.id === tag.id));

  const tagDetail = await request(baseUrl, `/api/tags/${tagSlug}`);
  assert.equal(tagDetail.response.status, 200);
  assert.equal(tagDetail.body.data.tag.id, tag.id);
  assert.ok(tagDetail.body.data.posts.some((item) => item.id === firstPost.id));
  assert.ok(tagDetail.body.data.places.some((item) => item.id === place.id));

  const relatedTags = await request(
    baseUrl,
    `/api/tags/${tagSlug}/related`
  );
  assert.equal(relatedTags.response.status, 200);
  assert.ok(
    relatedTags.body.data.items.some((item) => item.id === relatedTag.id)
  );

  const recommendations = await request(
    baseUrl,
    "/api/recommendations?lat=10.7769&lng=106.7009"
  );
  assert.equal(recommendations.response.status, 200);
  assert.ok(
    recommendations.body.data.recommendations.places.some(
      (item) => item.id === place.id
    )
  );

  const invalidBounds = await request(
    baseUrl,
    "/api/map/places?north=10.8"
  );
  assert.equal(invalidBounds.response.status, 422);
});
