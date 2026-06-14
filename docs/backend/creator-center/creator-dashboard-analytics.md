# Creator Dashboard And Analytics

## Endpoint

- `GET /api/creator/stats`
- `GET /api/creator/top-posts`
- `GET /api/creator/analytics`
- `GET /api/analytics/posts/:id`

## Creator Stats

Trả profile creator, số post theo status, follower/following, tổng và trung
bình views, likes, comments, shares, saves, engagement.

## Top Posts

Query `metric` hỗ trợ `engagement`, `views`, `likes`, `comments`, `saves`,
`shares`; `limit` tối đa 50. Response có rank và metric value.

## Creator Analytics

Query `period` hỗ trợ `7d`, `30d`, `90d`, `all`. Response gồm summary, chuỗi
theo ngày và aggregate theo post type.

Hiện tại chưa có bảng analytics events nên chuỗi thời gian dùng counters hiện
tại của post và nhóm theo ngày post được tạo. Response có trường `methodology`
để diễn giải giới hạn này. Khi nhóm infra analytics triển khai event table,
repository có thể thay nguồn dữ liệu mà không đổi routes.

## Post Analytics

Chỉ creator sở hữu post hoặc admin audit đúng `creator_id` mới truy cập được.
Trả counters, engagement, engagement rate, thứ hạng engagement trong toàn bộ
post của creator và tổng số post dùng để xếp hạng.

## Bảo mật và kiểm thử

- Tất cả endpoint dùng `requireAuth` và `requireRole("creator", "admin")`.
- Ownership luôn khóa bằng `authorId` ở repository, không chỉ kiểm tra tại
  controller.
- Integration test bao phủ unauthenticated, role user, creator scope, admin
  scope, filter, ranking và công thức counters.
