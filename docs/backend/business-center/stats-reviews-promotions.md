# Business Stats, Reviews And Promotions

## Endpoint

- `GET /api/business/stats`
- `GET /api/business/reviews`
- `GET /api/business/promotions`
- `POST /api/business/promotions`
- `PATCH /api/business/promotions/:id`
- `DELETE /api/business/promotions/:id`

## Stats và reviews

- Stats tổng hợp số place, review, rating, favorite, post, promotion và các
  counters reach trên toàn bộ place thuộc business.
- Reviews dùng page/limit, chỉ trả review approved của user active và kèm
  business reply nếu có.

## Promotion

- Create chạy transaction tạo `posts` loại `promotion` và `promotions`.
- Promotion có `validFrom`, `validTo`, discount, conditions và status.
- Update kiểm tra ownership bằng `business_profile_id`, đồng thời có thể cập
  nhật caption của post.
- Delete là soft-delete đồng bộ cả promotion và post để giữ lịch sử.
- Public discovery tự lọc promotion active và còn hiệu lực.

## Kiểm thử

`apps/api/tests/business-center.test.js` bao phủ role guard, approved gate,
public privacy, place/menu, media ownership, reviews, stats, promotion
transaction, admin scope và soft-delete.
