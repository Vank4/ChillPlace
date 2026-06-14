# Creator Posts

## Endpoint

- `GET /api/creator/posts`

## Quyền truy cập

- Yêu cầu JWT và role `creator` hoặc `admin`.
- Creator chỉ xem post có `author_id` là chính mình.
- Creator truyền `creator_id` khác tài khoản sẽ nhận HTTP `403`.
- Admin có thể truyền `creator_id` để xem dữ liệu của creator cụ thể.

## Query

- `q`: tìm trong caption, tên place và tag.
- `status`: `pending`, `approved`, `rejected`, `hidden`, `deleted`.
- `type`: `review`, `promotion`, `event`, `album`.
- `sort`: `newest`, `oldest`, `views`, `likes`, `comments`, `saves`.
- `page`, `limit`: pagination, giới hạn tối đa 50.

## Response

Mỗi post có media, place, tags, trạng thái, visibility, counters,
`engagement` và `engagementRate`. Engagement bằng tổng like, comment, share
và save; rate tính theo phần trăm trên view.

## File chính

- `apps/api/src/modules/creator/creator.repository.js`
- `apps/api/src/modules/creator/creator.service.js`
- `apps/api/src/modules/creator/creator.routes.js`
