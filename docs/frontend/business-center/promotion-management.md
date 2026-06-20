# Promotion Management

- Route: `/business/promotions`
- Nhóm: `business-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/business/pages/BusinessPromotionsPage.jsx`
- `apps/web/src/features/business/pages/BusinessPages.css`
- `apps/web/src/features/business/components/BusinessCenterNav.jsx`
- `apps/web/src/services/business.service.js`

## Nội dung triển khai

- Form tạo khuyến mãi mới với tiêu đề, mô tả, ngày bắt đầu/kết thúc, loại ưu đãi và nhãn ưu đãi.
- Preview live cho promotion card.
- Danh sách chiến dịch, search và lọc theo trạng thái.
- Metric số chiến dịch đang chạy, lượt tiếp cận, lượt đổi mã và tỷ lệ đổi.
- Lưu promotion mới vào localStorage mock.

## Responsive

- Desktop chia form và preview.
- Mobile chuyển một cột, toolbar cuộn ngang khi cần.

## Kiểm tra

- `npm run build`: thành công.

