# Database Setup

## Phạm vi

Thiết lập MySQL 8.x, Prisma Client, database bootstrap, migration deploy và
health probe cho database `chillplace`.

## File liên quan

- `prisma/schema.prisma`
- `prisma/migrations/20260526000100_init/migration.sql`
- `apps/api/src/scripts/db/bootstrap.js`
- `apps/api/src/common/utils/prisma.js`
- `apps/api/src/common/utils/dbHealth.js`

## Cách hoạt động

- `npm run db:bootstrap` tạo database nếu chưa tồn tại với charset `utf8mb4`.
- Tên database chỉ chấp nhận chữ, số và dấu gạch dưới trước khi được dùng trong
  câu lệnh bootstrap.
- `npm run prisma:generate` tạo Prisma Client.
- `npm run prisma:deploy` áp dụng migration đã commit.
- Prisma Client dùng `DATABASE_URL` đã được kiểm tra bởi `env.js`.
- Development tái sử dụng Prisma Client để tránh tạo nhiều connection pool khi
  Node watch reload module.

## Kết quả kiểm tra

- MySQL `127.0.0.1:3306` kết nối thành công.
- Migration deploy: không còn migration chờ.
- Health endpoint trả database `up`.
- Foundation integration test thực hiện truy vấn `SELECT 1` thành công.

Seed dữ liệu nghiệp vụ vẫn để dành cho nhóm Infra Testing Deployment; file seed
hiện tại mới là placeholder và không được tính là demo seed hoàn chỉnh.
