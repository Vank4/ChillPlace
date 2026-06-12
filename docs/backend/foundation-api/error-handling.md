# Error Handling

## File liên quan

- `apps/api/src/common/errors/AppError.js`
- `apps/api/src/middlewares/notFound.middleware.js`
- `apps/api/src/middlewares/error.middleware.js`

## Nội dung triển khai

- `AppError` có factory cho `400`, `401`, `403`, `404`, `409`, `422`.
- Chuẩn hóa lỗi Zod, Multer và Prisma.
- Prisma `P2002` trả `409`; `P2025` trả `404`.
- JSON sai cú pháp trả `400`.
- Route không tồn tại trả `404` kèm method và path.
- Lỗi ngoài dự kiến trả thông báo chung, không làm lộ stack hoặc message nội bộ
  trong response.
- Lỗi server được ghi log kèm method và path.

## Kiểm tra

Test bao phủ AppError, lỗi nội bộ, JSON sai cú pháp và route không tồn tại.
