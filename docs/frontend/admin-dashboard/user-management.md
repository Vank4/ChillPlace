# User Management

- Route: `/admin/users`, hỗ trợ query `?q=`.
- Có tìm kiếm, lọc vai trò, bảng người dùng, trạng thái active/suspended và thao tác khóa/mở khóa.
- Thay đổi được lưu trong `localStorage` qua `admin.service.js`.
- Bảng cuộn ngang an toàn trên mobile; toolbar chuyển thành layout dọc.
- Build: `npm run build` pass.
- Visual analytics: donut phân bổ vai trò, sparkline đăng ký mới và horizontal bars chất lượng hồ sơ.
