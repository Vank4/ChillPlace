# User Reports

## Endpoint

- `POST /api/reports`

## Payload

- `targetType`: `post`, `comment`, `review`, `place`, `user` hoặc `tag`
- `targetId`: số nguyên dương
- `reason`: từ 10 đến 1000 ký tự

## Quy tắc

- Yêu cầu JWT và mutation rate limiter.
- Target phải tồn tại và đang công khai/active/approved tùy loại.
- Report mới có status `pending`.
- Cùng user, target type và target id không thể tạo thêm pending report trong
  vòng 10 phút.
- Endpoint admin xử lý report thuộc nhóm Admin Moderation, không nằm trong
  phạm vi module này.

## Kiểm thử

Integration test xác nhận report hợp lệ trả HTTP `201`, report lặp nhanh trả
HTTP `409` và target không tồn tại trả `404`.
