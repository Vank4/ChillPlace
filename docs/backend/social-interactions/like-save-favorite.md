# Like, Save And Favorite

## Endpoint

- `POST /api/posts/:id/like`
- `POST /api/posts/:id/save`
- `POST /api/places/:id/favorite`
- `GET /api/favorites`
- `GET /api/users/me/saved`

## Database

- Like dùng unique `(user_id, target_type, target_id)`.
- Favorite dùng unique `(user_id, place_id)`.
- Migration `20260614000100_social_interactions` tạo `saved_posts` với unique
  `(user_id, post_id)`.

## Quy tắc

- Mutation yêu cầu JWT, mutation rate limiter và target công khai còn active.
- Like/save/favorite là toggle; gọi lần hai sẽ bỏ trạng thái hiện tại.
- Like và save cập nhật lại `like_count`/`save_count` bằng count thật trong
  cùng transaction.
- Response mutation trả state và counter mới nhất để frontend sync optimistic
  UI.
- Saved/favorites chỉ trả post/place vẫn còn công khai, có page/limit.
- Like mới tạo notification cho tác giả nếu người like không phải tác giả.

## File chính

- `apps/api/src/modules/interactions/interactions.repository.js`
- `apps/api/src/modules/interactions/interactions.service.js`
- `apps/api/src/modules/interactions/interactions.routes.js`
