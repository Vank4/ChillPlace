# Security Middleware

## Công nghệ

- Helmet
- CORS
- express-rate-limit

## File liên quan

- `apps/api/src/app.js`
- `apps/api/src/config/cors.js`
- `apps/api/src/middlewares/security.middleware.js`

## Nội dung triển khai

- Tắt header `X-Powered-By`.
- Helmet thêm security headers.
- CORS allowlist lấy từ `FRONTEND_URL` hoặc `CORS_ORIGIN`, hỗ trợ nhiều origin
  phân tách bằng dấu phẩy.
- Body JSON và URL-encoded giới hạn `2mb`.
- Global API limiter: 300 request / 15 phút.
- Auth limiter: 20 request / 15 phút.
- Mutation limiter: 60 request / phút.
- Upload limiter: 30 request / 15 phút.
- Response rate limit dùng contract lỗi chuẩn với status `429`.

Các limiter chuyên biệt sẽ được gắn vào route tương ứng khi triển khai module.

## Kiểm tra

Test bao phủ rate limit, Helmet headers, loại bỏ `X-Powered-By` và CORS origin bị
từ chối.

`npm audit --omit=dev` trả `0 vulnerabilities` sau khi nâng `bcrypt` lên
`6.0.0`.
