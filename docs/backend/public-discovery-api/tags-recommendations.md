# Tags And Recommendations

## Endpoint

- `GET /api/tags/trending`
- `GET /api/tags/search`
- `GET /api/tags/:slug`
- `GET /api/tags/:slug/related`
- `GET /api/recommendations`

## Quy tắc

- Chỉ trả tag `active` và nội dung post/place công khai đã duyệt.
- Trending sắp xếp theo `usageCount`.
- Tag detail trả metadata tag, post và danh sách place rút ra từ các post đó.
- Related tags được tính từ số post công khai cùng gắn hai tag.
- Recommendations là API public có optional Bearer token.
- Khi user có `user_tag_preferences`, post/tag ưu tiên theo sở thích; nếu
  không có thì dùng popularity. Khi có `lat/lng`, place được ưu tiên theo
  khoảng cách.
- Recommendations trả trường `strategy` để frontend/debug biết chiến lược
  đang dùng.

## File chính

- `apps/api/src/modules/tags/tags.repository.js`
- `apps/api/src/modules/tags/tags.service.js`
- `apps/api/src/modules/tags/tags.routes.js`
- `apps/api/src/modules/discovery/discovery.service.js`

## Kiểm thử

Integration test kiểm tra trending, tag search, tag detail, related tags và
recommendation theo tọa độ.
