# Users, Places And Content Moderation

## Endpoint

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/status`
- `GET /api/admin/places`
- `PATCH /api/admin/places/:id/status`
- `PATCH /api/admin/posts/:id/status`
- `PATCH /api/admin/comments/:id/status`

## Phân quyền và truy vấn

- Toàn bộ endpoint yêu cầu access token và role `admin`.
- Danh sách user/place hỗ trợ pagination, tìm kiếm và lọc trạng thái.
- Response user loại bỏ `passwordHash`.
- Stats tổng hợp theo role/status cho user và theo status cho các tài nguyên
  kiểm duyệt.

## Chốt an toàn

- Không cho vô hiệu hóa admin active cuối cùng.
- Không cho admin xóa chính tài khoản đang đăng nhập.
- Mỗi lần đổi trạng thái đều ghi `audit_logs` trong cùng transaction.
- Khi trạng thái comment thay đổi, `posts.comment_count` được tính lại từ số
  comment `approved`.
