# Reports, Tags, Categories And Audit

## Endpoint

- `GET /api/admin/audit-logs`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id/resolve`
- `GET /api/admin/tags`
- `PATCH /api/admin/tags/:id/status`
- `POST /api/admin/tags/merge`
- `GET /api/admin/categories`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/:id`

## Reports và audit

- Report hỗ trợ lọc theo status và target type.
- Chỉ report `pending` được resolve/dismiss.
- Resolve cập nhật người xử lý, thời gian xử lý, gửi notification cho reporter
  và ghi audit log trong transaction.
- Audit log hỗ trợ lọc theo action, target type, admin và pagination.

## Tags

- Merge chuyển toàn bộ `post_tags` sang target và loại bỏ bản ghi trùng.
- Điểm `user_tag_preferences` của source được cộng vào target.
- `usage_count` của target được tính lại; source chuyển sang `merged` và lưu
  `merged_to_tag_id`.
- Tag đã merge không thể đổi trạng thái hoặc merge lại.

## Categories

- Admin có thể tìm kiếm, tạo và cập nhật category.
- Name/slug giữ unique theo database.
- Parent phải tồn tại, chưa bị xóa và category không thể tự làm parent.
- Create/update category đều ghi audit snapshot an toàn.
