# Auth Register, Login And Current User

## Phạm vi

Triển khai đăng ký, đăng nhập và truy xuất tài khoản hiện tại bằng JWT access
token.

## Endpoint

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## File liên quan

- `apps/api/src/modules/auth/auth.routes.js`
- `apps/api/src/modules/auth/auth.controller.js`
- `apps/api/src/modules/auth/auth.service.js`
- `apps/api/src/modules/auth/auth.validation.js`
- `apps/api/src/middlewares/auth.middleware.js`
- `apps/api/src/common/utils/password.js`
- `apps/api/src/common/utils/jwt.js`
- `apps/api/src/modules/users/user.repository.js`
- `apps/api/src/modules/users/user.serializer.js`

## Quy tắc nghiệp vụ

- Email được trim, chuyển lowercase và không được trùng.
- Username chỉ gồm chữ thường, chữ số và dấu gạch dưới. Nếu không truyền,
  server tạo username duy nhất từ họ tên hoặc email.
- Mật khẩu dài từ 8 đến 72 ký tự và được hash bằng bcrypt.
- Tài khoản mới luôn có role `user` và status `active`; client không được tự
  gán role hoặc status.
- Đăng nhập trả cùng một thông báo cho email không tồn tại và sai mật khẩu để
  hạn chế lộ thông tin tài khoản.
- JWT chứa `sub` và role, có issuer/audience và thời gian hết hạn lấy từ env.
- `requireAuth` xác minh token, sau đó đọc lại user từ database. Tài khoản
  không còn `active` bị từ chối ngay cả khi token chưa hết hạn.
- Serializer không bao giờ trả `passwordHash`.
- Register và login dùng auth rate limiter.

## Response chính

Register trả HTTP `201`; login và current user trả HTTP `200`. Payload auth
gồm `accessToken`, `tokenType: "Bearer"` và user đã được lọc trường nhạy cảm.

## Kiểm thử

`apps/api/tests/auth-user.test.js` kiểm tra đăng ký, email trùng, sai mật khẩu,
token thiếu/sai, current user, ẩn password hash và tài khoản bị khóa.
