# OpenAPI And Deployment

## API contract

- `GET /api/docs`: danh mục endpoint theo nhóm.
- `GET /api/docs/openapi.json`: OpenAPI `3.0.3`.
- Contract mô tả public/protected route, bearer JWT và response chuẩn.
- JSON có thể import vào Swagger Editor hoặc công cụ API client.

## Deployment files

- `infra/docker/api.Dockerfile`
- `.dockerignore`
- `render.yaml`
- `railway.json`

Container dùng Node.js 22, generate Prisma lúc build và chạy
`prisma migrate deploy` trước khi start.

## Upload production

`UPLOAD_DRIVER=cloudinary` bật signed upload bằng các biến:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER`

Local Laragon tiếp tục dùng `UPLOAD_DRIVER=local`.

## Health và startup

- Provider health check: `GET /api/health`.
- `start:deploy` apply migration rồi mới chạy server.
- Server xử lý graceful shutdown cho `SIGINT` và `SIGTERM`.
