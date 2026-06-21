# Admin Dashboard

- Route: `/admin`
- Code: `features/admin/components/AdminLayout.jsx`, `features/admin/pages/AdminPages.jsx`
- Hiển thị metric hệ thống, biểu đồ tăng trưởng, sức khỏe dịch vụ, thao tác nhanh và nhật ký điều phối.
- Dữ liệu lấy từ `admin.service.js`, tự đồng bộ khi các màn quản trị khác cập nhật trạng thái.
- Responsive: bento grid thu gọn từ 4 cột xuống 2 cột; activity log ẩn metadata phụ trên mobile.
- Light/dark mode: dùng token và bề mặt Admin riêng, có hover/focus/active đầy đủ.
- Build: `npm run build` pass.

## Visual Redesign

- Bổ sung overview rail gồm sparkline người dùng, tương tác và donut uptime.
- Khu tăng trưởng dùng grouped bar chart; health panel dùng progress visualization; activity dùng operational timeline.
- Các chart có animation, hover và dark palette riêng; mobile chuyển thành horizontal snap rail để giữ khả năng đọc.
