# Creator Analytics Page

- Route: `/creator/analytics`
- Nhóm: `creator-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/creator/pages/CreatorAnalyticsPage.jsx`
- `apps/web/src/features/creator/pages/CreatorPages.css`
- `apps/web/src/features/creator/components/CreatorCenterNav.jsx`
- `apps/web/src/features/creator/components/CreatorCenterNav.css`
- `apps/web/src/services/creator.service.js`
- `apps/web/src/app/App.jsx`

## Nội dung triển khai

- Dashboard thống kê lượt xem, tệp tiếp cận, tỷ lệ tương tác và lượt chia sẻ.
- Biểu đồ cột 7 ngày gần nhất bằng CSS thuần.
- Khối insight gợi ý thời điểm đăng, kiểu ảnh và cách tăng bình luận.
- Danh sách top bài viết dựa trên lượt xem từ `getCreatorPostList()`.
- Dữ liệu tổng hợp từ cùng service với trang My Posts để giữ logic nhất quán.

## Responsive

- Desktop chia 2 cột cho chart và insight.
- Mobile chuyển thành một cột, chart thấp hơn và top post thu gọn ảnh/metadata.
- Kích thước card, heading, padding bám theo chuẩn scale đã ghi trong `frontend-implementation-notes.md`.

## Kiểm tra

- Cần chạy `npm run build` sau khi hoàn tất nhóm trang.

