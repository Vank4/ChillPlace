# Business Media

## Endpoint

- `GET /api/business/media`
- `POST /api/business/media`
- `PATCH /api/business/media/order`
- `DELETE /api/business/media/:id`

## Cách gửi media

`POST` hỗ trợ multipart field `files` qua upload foundation hoặc JSON
`mediaUrl`, `mediaType`, `thumbnailUrl`, `sortOrder`.

## Quy tắc

- Media phải thuộc place của business đang đăng nhập.
- Reorder xác minh toàn bộ id thuộc đúng place trước khi update transaction.
- Xóa media không thuộc ownership trả `404`.
- File local được xóa nếu request thất bại sau upload hoặc khi xóa bản ghi có
  URL `/uploads/...`.
- MIME, kích thước và số file dùng chung middleware upload foundation.

## File chính

- `apps/api/src/modules/business/business.repository.js`
- `apps/api/src/modules/business/business.service.js`
- `apps/api/src/modules/business/business.routes.js`
- `apps/api/src/middlewares/upload.middleware.js`
