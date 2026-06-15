import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";
import { prisma } from "../src/common/utils/prisma.js";
import { signAccessToken } from "../src/common/utils/jwt.js";

async function request(baseUrl, route, token, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const body = response.status === 204 ? null : await response.json();
  return { response, body };
}

test("business center API workflow", async (t) => {
  const suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  const users = await Promise.all(
    [
      ["business_main", "Main Business", "business"],
      ["business_pending", "Pending Business", "business"],
      ["business_other", "Other Business", "business"],
      ["business_admin", "Business Admin", "admin"],
      ["business_user", "Regular User", "user"],
      ["business_reviewer", "Business Reviewer", "user"]
    ].map(([prefix, fullName, role]) =>
      prisma.user.create({
        data: {
          username: `${prefix}_${suffix}`,
          fullName,
          email: `${prefix}_${suffix}@chillplace.test`,
          passwordHash: "test-only-hash",
          role,
          status: "active"
        }
      })
    )
  );
  const [businessUser, pendingUser, otherUser, admin, regularUser, reviewer] =
    users;
  const [business, pendingBusiness, otherBusiness] = await Promise.all([
    prisma.businessProfile.create({
      data: {
        userId: businessUser.id,
        businessName: `Business Main ${suffix}`,
        slug: `business-main-${suffix}`,
        phone: "0901234567",
        status: "approved",
        verifiedAt: new Date()
      }
    }),
    prisma.businessProfile.create({
      data: {
        userId: pendingUser.id,
        businessName: `Business Pending ${suffix}`,
        slug: `business-pending-${suffix}`,
        status: "pending"
      }
    }),
    prisma.businessProfile.create({
      data: {
        userId: otherUser.id,
        businessName: `Business Other ${suffix}`,
        slug: `business-other-${suffix}`,
        status: "approved",
        verifiedAt: new Date()
      }
    })
  ]);
  const [place, otherPlace] = await Promise.all([
    prisma.place.create({
      data: {
        name: `Business Place ${suffix}`,
        slug: `business-place-${suffix}`,
        address: "1 Nguyen Hue",
        city: "Ho Chi Minh City",
        status: "approved",
        businessProfileId: business.id,
        ratingAvg: 4,
        ratingCount: 1
      }
    }),
    prisma.place.create({
      data: {
        name: `Other Place ${suffix}`,
        slug: `other-business-place-${suffix}`,
        status: "approved",
        businessProfileId: otherBusiness.id
      }
    })
  ]);
  const review = await prisma.review.create({
    data: {
      userId: reviewer.id,
      placeId: place.id,
      rating: 4,
      content: "Business center test review",
      status: "approved"
    }
  });
  await prisma.favorite.create({
    data: { userId: regularUser.id, placeId: place.id }
  });

  const businessToken = signAccessToken(businessUser);
  const pendingToken = signAccessToken(pendingUser);
  const otherToken = signAccessToken(otherUser);
  const adminToken = signAccessToken(admin);
  const userToken = signAccessToken(regularUser);
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  t.after(async () => {
    try {
      await prisma.post.deleteMany({
        where: { authorId: { in: [businessUser.id, otherUser.id] } }
      });
      await prisma.place.deleteMany({
        where: { id: { in: [place.id, otherPlace.id] } }
      });
      await prisma.businessProfile.deleteMany({
        where: {
          id: { in: [business.id, pendingBusiness.id, otherBusiness.id] }
        }
      });
      await prisma.user.deleteMany({
        where: { id: { in: users.map((user) => user.id) } }
      });
    } finally {
      await new Promise((resolve) => server.close(resolve));
      await prisma.$disconnect().catch(() => undefined);
    }
  });

  const unauthenticated = await request(baseUrl, "/api/business/me");
  assert.equal(unauthenticated.response.status, 401);

  const forbiddenRole = await request(
    baseUrl,
    "/api/business/me",
    userToken
  );
  assert.equal(forbiddenRole.response.status, 403);

  const pendingMe = await request(
    baseUrl,
    "/api/business/me",
    pendingToken
  );
  assert.equal(pendingMe.response.status, 200);
  assert.equal(pendingMe.body.data.business.status, "pending");

  const pendingPlace = await request(
    baseUrl,
    "/api/business/place",
    pendingToken
  );
  assert.equal(pendingPlace.response.status, 403);

  const me = await request(baseUrl, "/api/business/me", businessToken);
  assert.equal(me.response.status, 200);
  assert.equal(me.body.data.business.id, business.id);
  assert.equal(me.body.data.business.places[0].id, place.id);

  const updateMe = await request(
    baseUrl,
    "/api/business/me",
    businessToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        businessName: `Business Updated ${suffix}`,
        address: "2 Nguyen Hue"
      })
    }
  );
  assert.equal(updateMe.response.status, 200);
  assert.equal(
    updateMe.body.data.business.businessName,
    `Business Updated ${suffix}`
  );

  const publicProfile = await request(
    baseUrl,
    `/api/business/business-main-${suffix}/public`
  );
  assert.equal(publicProfile.response.status, 200);
  assert.equal(publicProfile.body.data.business.owner.email, undefined);
  assert.equal(publicProfile.body.data.business.places[0].id, place.id);

  const businessPlace = await request(
    baseUrl,
    "/api/business/place",
    businessToken
  );
  assert.equal(businessPlace.response.status, 200);
  assert.equal(businessPlace.body.data.place.id, place.id);

  const updatePlace = await request(
    baseUrl,
    "/api/business/place",
    businessToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        address: "3 Nguyen Hue",
        district: "District 1",
        priceMin: 30000,
        priceMax: 90000,
        openingHours: { daily: "07:00-22:00" }
      })
    }
  );
  assert.equal(updatePlace.response.status, 200);
  assert.equal(updatePlace.body.data.place.priceMin, 30000);

  const menu = await request(baseUrl, "/api/business/menu", businessToken, {
    method: "PATCH",
    body: JSON.stringify({
      categories: [
        {
          name: "Coffee",
          items: [
            {
              name: "Cold Brew",
              description: "Slow brewed coffee",
              price: 55000,
              available: true
            }
          ]
        }
      ]
    })
  });
  assert.equal(menu.response.status, 200);
  assert.equal(menu.body.data.menu.menuJson.categories[0].items[0].price, 55000);

  const addMedia = await request(
    baseUrl,
    "/api/business/media",
    businessToken,
    {
      method: "POST",
      body: JSON.stringify({
        mediaUrl: `https://example.com/business-${suffix}.jpg`,
        mediaType: "image",
        sortOrder: 3
      })
    }
  );
  assert.equal(addMedia.response.status, 201);
  const mediaId = addMedia.body.data.items[0].id;

  const media = await request(baseUrl, "/api/business/media", businessToken);
  assert.equal(media.response.status, 200);
  assert.ok(media.body.data.items.some((item) => item.id === mediaId));

  const reorder = await request(
    baseUrl,
    "/api/business/media/order",
    businessToken,
    {
      method: "PATCH",
      body: JSON.stringify({ items: [{ id: mediaId, sortOrder: 0 }] })
    }
  );
  assert.equal(reorder.response.status, 200);
  assert.equal(reorder.body.data.items[0].sortOrder, 0);

  const otherCannotDeleteMedia = await request(
    baseUrl,
    `/api/business/media/${mediaId}`,
    otherToken,
    { method: "DELETE" }
  );
  assert.equal(otherCannotDeleteMedia.response.status, 404);

  const businessReviews = await request(
    baseUrl,
    "/api/business/reviews",
    businessToken
  );
  assert.equal(businessReviews.response.status, 200);
  assert.equal(businessReviews.body.data.items[0].id, review.id);

  const createPromotion = await request(
    baseUrl,
    "/api/business/promotions",
    businessToken,
    {
      method: "POST",
      body: JSON.stringify({
        title: `Happy Hour ${suffix}`,
        description: "Business promotion integration test",
        discountText: "20%",
        validFrom: new Date(Date.now() - 60000).toISOString(),
        validTo: new Date(Date.now() + 86400000).toISOString()
      })
    }
  );
  assert.equal(createPromotion.response.status, 201);
  const promotion = createPromotion.body.data.promotion;
  assert.equal(promotion.post.postType, "promotion");
  assert.equal(promotion.post.place.id, place.id);

  const promotions = await request(
    baseUrl,
    "/api/business/promotions",
    businessToken
  );
  assert.equal(promotions.response.status, 200);
  assert.equal(promotions.body.pagination.total, 1);

  const updatePromotion = await request(
    baseUrl,
    `/api/business/promotions/${promotion.id}`,
    businessToken,
    {
      method: "PATCH",
      body: JSON.stringify({
        title: `Happy Hour Updated ${suffix}`,
        status: "inactive",
        caption: "Updated promotion caption"
      })
    }
  );
  assert.equal(updatePromotion.response.status, 200);
  assert.equal(updatePromotion.body.data.promotion.status, "inactive");
  assert.equal(
    updatePromotion.body.data.promotion.post.caption,
    "Updated promotion caption"
  );

  const otherCannotUpdatePromotion = await request(
    baseUrl,
    `/api/business/promotions/${promotion.id}`,
    otherToken,
    {
      method: "PATCH",
      body: JSON.stringify({ title: "Forbidden update" })
    }
  );
  assert.equal(otherCannotUpdatePromotion.response.status, 404);

  const stats = await request(baseUrl, "/api/business/stats", businessToken);
  assert.equal(stats.response.status, 200);
  assert.equal(stats.body.data.stats.places, 1);
  assert.equal(stats.body.data.stats.reviews, 1);
  assert.equal(stats.body.data.stats.favorites, 1);
  assert.equal(stats.body.data.stats.promotions.inactive, 1);

  const adminMe = await request(
    baseUrl,
    `/api/business/me?business_id=${business.id}`,
    adminToken
  );
  assert.equal(adminMe.response.status, 200);
  assert.equal(adminMe.body.data.business.id, business.id);

  const adminWithoutScope = await request(
    baseUrl,
    "/api/business/me",
    adminToken
  );
  assert.equal(adminWithoutScope.response.status, 422);

  const deletePromotion = await request(
    baseUrl,
    `/api/business/promotions/${promotion.id}`,
    businessToken,
    { method: "DELETE" }
  );
  assert.equal(deletePromotion.response.status, 204);

  const deletedRecords = await prisma.promotion.findUnique({
    where: { id: promotion.id },
    include: { post: true }
  });
  assert.equal(deletedRecords.status, "deleted");
  assert.equal(deletedRecords.post.status, "deleted");

  const deleteMedia = await request(
    baseUrl,
    `/api/business/media/${mediaId}`,
    businessToken,
    { method: "DELETE" }
  );
  assert.equal(deleteMedia.response.status, 204);
});
