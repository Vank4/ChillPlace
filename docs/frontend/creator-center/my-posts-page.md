# My Posts Page

- Route: `/creator/posts`
- Nhóm: `creator-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/creator/pages/CreatorPostsPage.jsx`
- `apps/web/src/features/creator/pages/CreatorPages.css`
- `apps/web/src/features/creator/components/CreatorCenterNav.jsx`
- `apps/web/src/features/creator/components/CreatorCenterNav.css`
- `apps/web/src/services/creator.service.js`
- `apps/web/src/app/App.jsx`

## Nội dung triển khai

- Danh sách bài viết của creator với trạng thái `Đã đăng` và `Lên lịch`.
- Thanh tìm kiếm theo tiêu đề, nội dung, địa điểm.
- Bộ lọc nhanh theo trạng thái bài viết.
- Thống kê tổng lượt xem, thích, bình luận và chia sẻ.
- Card bài viết có ảnh, địa điểm, hashtag, thời gian và chỉ số hiệu suất.
- Dữ liệu lấy từ localStorage qua `getCreatorPostList()`, có mock fallback để giao diện luôn có nội dung.

## Responsive

- Desktop dùng layout 3 cột trong card để tận dụng không gian ngang.
- Tablet/mobile tự thu về card 2 cột, sau đó 1 cột ở viewport nhỏ.
- Tab Creator Center và toolbar được làm thấp, gọn để không chiếm quá nhiều khung hình chính.

## Kiểm tra

- Cần chạy `npm run build` sau khi hoàn tất nhóm trang.

