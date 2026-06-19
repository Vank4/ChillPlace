# Drafts Page

- Route: `/creator/drafts`
- Nhóm: `creator-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/creator/pages/CreatorDraftsPage.jsx`
- `apps/web/src/features/creator/pages/CreatorPages.css`
- `apps/web/src/features/creator/components/CreatorCenterNav.jsx`
- `apps/web/src/features/creator/components/CreatorCenterNav.css`
- `apps/web/src/services/creator.service.js`
- `apps/web/src/app/App.jsx`

## Nội dung triển khai

- Danh sách bản nháp của creator, bao gồm bản nháp tự động từ trang tạo bài.
- Tìm kiếm bản nháp theo tiêu đề, nội dung hoặc địa điểm.
- Chỉ số nhanh: tổng bản nháp, số bản nháp gần sẵn sàng, thời gian cập nhật gần nhất.
- Card bản nháp hiển thị tiến độ hoàn thiện và các mục còn thiếu.
- Có hành động mở chỉnh sửa và xóa bản nháp; bản nháp tự động được xóa khỏi localStorage khi người dùng xóa.

## Responsive

- Desktop dùng grid 2 cột để xem nhiều nháp cùng lúc.
- Mobile chuyển về card gọn, ảnh thu nhỏ và nút hành động nằm trong một hàng rõ ràng.
- Empty state chỉ xuất hiện khi lọc không còn bản nháp phù hợp.

## Kiểm tra

- Cần chạy `npm run build` sau khi hoàn tất nhóm trang.

