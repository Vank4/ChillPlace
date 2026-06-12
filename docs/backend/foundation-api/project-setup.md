# Project Setup

## Phạm vi

Hoàn thiện nền tảng khởi động cho Express API, cấu hình môi trường, lifecycle
server, logging cơ bản và health check.

## Endpoint

- `GET /api/health`

Response health gồm tên service, môi trường chạy, uptime, timestamp, trạng thái
database và thời gian phản hồi truy vấn database.

## File liên quan

- `apps/api/src/app.js`
- `apps/api/src/server.js`
- `apps/api/src/config/env.js`
- `apps/api/src/config/cors.js`
- `apps/api/src/common/logger/index.js`
- `apps/api/src/modules/health/*`
- `apps/api/.env.example`
- `apps/api/tests/foundation.test.js`

## Nội dung triển khai

- Express app dùng Helmet, CORS, JSON parser, request logger và static uploads.
- Server kết nối Prisma trước khi listen và đóng HTTP/Prisma khi nhận
  `SIGINT` hoặc `SIGTERM`.
- Environment được kiểm tra tập trung; thiếu `DATABASE_URL` hoặc `JWT_SECRET`
  sẽ dừng khởi động.
- Production từ chối `JWT_SECRET=change_me`.
- Port mặc định theo contract backend là `3000`.
- Logging server có timestamp, level và metadata có cấu trúc.
- Route không tồn tại trả response lỗi chuẩn.

## Environment

Các biến bắt buộc:

- `DATABASE_URL`
- `JWT_SECRET`

Các biến có giá trị mặc định cho local:

- `NODE_ENV=development`
- `PORT=3000`
- `APP_URL=http://localhost:3000`
- `FRONTEND_URL=http://localhost:5173`
- `JWT_EXPIRES_IN=7d`
- `UPLOAD_DRIVER=local`
- `UPLOAD_DIR=uploads`
- `MAX_IMAGE_SIZE_MB=5`
- `MAX_VIDEO_SIZE_MB=80`

## Kiểm tra

```bash
cd apps/api
npm test
npm run start
```

Sau khi server chạy:

```text
GET http://localhost:3000/api/health
```

Test tự động kiểm tra environment defaults, required variables, production JWT
secret và response `404`.

## Kết quả kiểm tra

- `npm test`: đạt toàn bộ foundation test.
- `npm run prisma:generate`: thành công với Prisma Client `5.22.0`.
- `GET /api/health`: trả `200`, database `up`.
