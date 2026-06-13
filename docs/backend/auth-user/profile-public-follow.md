# User Profile, Public Profile And Follow

## Phạm vi

Triển khai cập nhật profile, xem profile/bài viết công khai và toggle
follow/unfollow.

## Endpoint

- `PATCH /api/users/me`
- `GET /api/users/:username/public`
- `GET /api/users/:id/posts`
- `POST /api/users/:id/follow`

## File liên quan

- `apps/api/src/modules/users/users.routes.js`
- `apps/api/src/modules/users/users.controller.js`
- `apps/api/src/modules/users/users.service.js`
- `apps/api/src/modules/users/users.validation.js`
- `apps/api/src/modules/users/user.repository.js`
- `apps/api/src/modules/users/user.serializer.js`
- `prisma/migrations/20260613000100_auth_user_profile/migration.sql`

## Database

Migration bổ sung `phone`, `cover_url`, `location` cho bảng `users` và index
`(role, status)`. Follow sử dụng unique key `(follower_id, following_id)` đã
có trong schema ban đầu.

## Quy tắc nghiệp vụ

- Update profile chỉ cho phép `fullName`, `username`, `phone`, `avatarUrl`,
  `coverUrl`, `bio` và `location`; payload có role/status bị validation từ
  chối.
- Public profile chỉ hiển thị user `active`, không trả email, phone hoặc
  password hash.
- Khi có optional Bearer token, public profile trả thêm `isFollowing`.
- Danh sách bài viết chỉ trả post `approved` và có pagination.
- User không được follow chính mình hoặc user không active.
- Endpoint follow là toggle theo trạng thái hiện tại. Follow mới tạo
  notification `new_follower`; unfollow xóa quan hệ.
- Update profile và follow dùng mutation rate limiter.

## Kiểm thử

Integration test kiểm tra whitelist update profile, public privacy, pagination,
self-follow, follow/unfollow, follower count và notification.
