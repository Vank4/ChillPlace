# Role Requests

## Endpoint

- `POST /api/role-requests/creator`
- `POST /api/role-requests/business`
- `GET /api/role-requests/me`
- `GET /api/admin/role-requests`
- `PATCH /api/admin/role-requests/:id/approve`
- `PATCH /api/admin/role-requests/:id/reject`

## Luồng nghiệp vụ

- Chỉ tài khoản role `user` được gửi yêu cầu nâng cấp.
- Mỗi user chỉ có một yêu cầu `pending` cho từng loại role.
- Dữ liệu đăng ký riêng của Creator/Business được lưu trong
  `role_requests.application_data`.
- Approve Creator cập nhật role và upsert `creator_profiles`.
- Approve Business cập nhật role, upsert `business_profiles`, đặt trạng thái
  `approved` và ghi `verified_at`.
- Reject không thay đổi role hoặc tạo profile.

## Tính toàn vẹn

Approve/reject chạy trong transaction, đồng thời cập nhật role request, profile,
notification và audit log. Yêu cầu đã được xử lý không thể duyệt lần hai.

Migration: `20260615000100_admin_role_requests`.
