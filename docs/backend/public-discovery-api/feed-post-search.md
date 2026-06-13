# Feed, Post Detail And Unified Search

## Endpoint

- `GET /api/feed`
- `GET /api/posts/:id`
- `GET /api/search`

## Quy tắc

- Feed và post detail chỉ trả post `approved`, visibility `public` và author
  `active`.
- Feed hỗ trợ filter `type`, `tag`, `limit` và cursor mã hóa.
- Response feed có `cursor.next_cursor` và `cursor.has_more`.
- Post serializer trả author công khai, place, media, tags và promotion.
- Unified search yêu cầu `q`, trả ba nhóm độc lập: `places`, `posts`, `tags`.
  Places/posts có pagination riêng.
- Post `hidden`, author không active và dữ liệu nhạy cảm của user không xuất
  hiện trong response.

## File chính

- `apps/api/src/modules/posts/posts.repository.js`
- `apps/api/src/modules/posts/posts.service.js`
- `apps/api/src/modules/posts/posts.routes.js`
- `apps/api/src/modules/discovery/discovery.service.js`
- `apps/api/src/modules/discovery/discovery.routes.js`

## Kiểm thử

Integration test kiểm tra hai trang cursor không trùng, post detail công khai,
post hidden trả 404 và unified search có grouped result.
