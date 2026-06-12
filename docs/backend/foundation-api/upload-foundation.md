# Upload Foundation

## Công nghệ

- Multer `2.x`
- Local disk storage cho development

## File liên quan

- `apps/api/src/middlewares/upload.middleware.js`
- `apps/api/uploads/`

## Quy tắc

- Ảnh cho phép: JPEG, PNG, WebP.
- Video cho phép: MP4.
- Ảnh tối đa `MAX_IMAGE_SIZE_MB`, mặc định 5 MB.
- Video tối đa `MAX_VIDEO_SIZE_MB`, mặc định 80 MB.
- Tối đa 10 file trong một request mặc định.
- Tên file do server tạo bằng UUID.
- Phần mở rộng lấy từ MIME đã cho phép, không tin tên file client.
- File lỗi được cleanup nếu upload dở dang.
- Binary không được lưu vào database.

## Sử dụng

```js
router.post("/upload", uploadRateLimiter, requireAuth, uploadMedia, controller);
```

Endpoint thật sẽ được mở trong module Media sau khi Auth hoàn thành.

## Kiểm tra

Test dùng memory storage để phù hợp môi trường test, bao phủ MIME hợp lệ, MIME bị
từ chối, tên file an toàn và ảnh vượt giới hạn.
