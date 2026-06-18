# ChillPlace API

Backend REST API cho ChillPlace, xây dựng bằng Node.js, Express, Prisma và
MySQL 8.

## Yêu cầu

- Node.js 20 trở lên.
- npm 10 trở lên.
- MySQL 8.x, có thể dùng Laragon trên Windows.

## Chạy local với Laragon

1. Bật MySQL trong Laragon.
2. Mở terminal tại `apps/api`.
3. Tạo file môi trường:

```powershell
Copy-Item .env.example .env
```

4. Kiểm tra `DATABASE_URL` trong `.env`:

```env
DATABASE_URL=mysql://root:@127.0.0.1:3306/chillplace
```

5. Cài dependency và setup database:

```powershell
npm install
npm run setup
```

6. Chạy API:

```powershell
npm run dev
```

API mặc định chạy tại `http://localhost:3000`.

## Script

| Lệnh | Chức năng |
| --- | --- |
| `npm run dev` | Chạy server với watch mode |
| `npm start` | Chạy server production |
| `npm run setup` | Tạo DB, generate Prisma, deploy migration và seed |
| `npm run prisma:deploy` | Apply migration chưa chạy |
| `npm run prisma:seed` | Tạo/cập nhật dữ liệu demo |
| `npm run prisma:studio` | Mở Prisma Studio |
| `npm test` | Chạy toàn bộ integration/unit test tuần tự |
| `npm run test:infra` | Chạy riêng test hạ tầng |
| `npm run verify` | Generate Prisma và chạy toàn bộ test |
| `npm run start:deploy` | Deploy migration rồi khởi động server |

## Tài khoản demo

Seed có thể chạy lặp mà không nhân bản dữ liệu.

| Role | Email |
| --- | --- |
| Admin | `admin@chillplace.local` |
| User | `user@chillplace.local` |
| Creator | `creator@chillplace.local` |
| Business | `business@chillplace.local` |

Mật khẩu chung: `ChillPlace@123`.

Seed còn tạo categories, places, tags, posts, media, review, comment,
promotion, favorite, saved post và follow để frontend có thể bỏ mock data.

## API và health check

- Health: `GET http://localhost:3000/api/health`
- API catalog: `GET http://localhost:3000/api/docs`
- OpenAPI 3.0 JSON: `GET http://localhost:3000/api/docs/openapi.json`

OpenAPI JSON có thể import trực tiếp vào Swagger Editor, Postman hoặc Bruno.

## Response contract

Success:

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {}
}
```

## Upload

Local:

```env
UPLOAD_DRIVER=local
UPLOAD_DIR=uploads
```

Render/Railway nên dùng Cloudinary vì filesystem của service có thể là tạm:

```env
UPLOAD_DRIVER=cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=chillplace
```

File được upload bằng signed request. Khi database operation thất bại, asset
vừa upload được cleanup; khi xóa business media, Cloudinary asset tương ứng
cũng được xóa.

## Deployment

### Docker

Từ thư mục gốc repository:

```powershell
docker build -f infra/docker/api.Dockerfile -t chillplace-api .
docker run --env-file apps/api/.env -p 3000:3000 chillplace-api
```

Container tự chạy migration trước khi start.

### Render

Repository có `render.yaml`. Tạo Blueprint, nhập `APP_URL`, `FRONTEND_URL`,
`DATABASE_URL` và Cloudinary credentials.

### Railway

Repository có `railway.json`. Tạo service từ repository, thêm MySQL và khai
báo các biến môi trường giống `.env.example`.

## Kiểm thử

Test dùng Node.js built-in test runner và gọi HTTP thật vào Express server.
Phạm vi hiện có:

- auth, permission và validation;
- pagination, search và filter;
- public discovery và social interactions;
- creator/business/admin workflow;
- transaction rollback;
- OpenAPI/docs và Cloudinary mapping;
- database health, security middleware và upload.

Các test database chạy tuần tự bằng `--test-concurrency=1` để tránh tranh chấp
fixture.
