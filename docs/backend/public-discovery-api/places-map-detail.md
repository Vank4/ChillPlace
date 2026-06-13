# Categories, Places, Map And Place Detail

## Endpoint

- `GET /api/categories`
- `GET /api/places`
- `GET /api/places/nearby`
- `GET /api/map/places`
- `GET /api/places/:slug`
- `GET /api/places/:id/reviews`
- `GET /api/places/:id/promotions`
- `GET /api/places/:id/related-posts`

## Query hỗ trợ

Places hỗ trợ `q`, `category`, `city`, `district`, `rating_min`, `open_now`,
`lat`, `lng`, `radius`, `sort`, `page`, `limit`. Nearby bắt buộc `lat/lng`.
Map nhận bounding box `north`, `south`, `east`, `west` và tối đa 200 marker.

## Quy tắc

- Chỉ trả category `active`, place `approved`, review/post `approved` và post
  có visibility `public`.
- Promotion phải `active`, đã đến `validFrom` và chưa qua `validTo`.
- `open_now` đọc lịch theo thứ trong `opening_hours`, hỗ trợ lịch qua nửa đêm.
- Nearby dùng Haversine và trả `distanceKm`.
- Place detail có media, category, business đã duyệt và thống kê review,
  post, favorite.
- List dùng page/limit; dữ liệu Decimal được chuyển sang JSON number.

## File chính

- `apps/api/src/modules/places/places.repository.js`
- `apps/api/src/modules/places/places.service.js`
- `apps/api/src/modules/places/places.routes.js`
- `apps/api/src/modules/places/map.routes.js`
- `apps/api/src/modules/places/categories.routes.js`

## Kiểm thử

`apps/api/tests/public-discovery.test.js` kiểm tra search/filter, nearby,
bounding box, detail, review, promotion, related posts và việc ẩn place
`pending`.
