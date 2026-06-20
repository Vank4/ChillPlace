# Business Reviews

- Route: `/business/reviews`
- Nhóm: `business-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/business/pages/BusinessReviewsPage.jsx`
- `apps/web/src/features/business/pages/BusinessPages.css`
- `apps/web/src/features/business/components/BusinessCenterNav.jsx`
- `apps/web/src/services/business.service.js`

## Nội dung triển khai

- Inbox đánh giá khách hàng.
- Search theo khách hàng, nội dung đánh giá và phản hồi.
- Lọc theo tất cả, chưa trả lời, đã trả lời.
- Metric rating trung bình, số review chưa trả lời, tỷ lệ phản hồi và số review đã trả lời.
- Form phản hồi từng review, cập nhật trạng thái vào localStorage mock.

## Responsive

- Card review co về một cột trên mobile.
- Form phản hồi và toast giữ khoảng cách với bottom navigation.

## Kiểm tra

- `npm run build`: thành công.

