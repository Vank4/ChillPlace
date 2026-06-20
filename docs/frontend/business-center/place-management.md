# Place Management

- Route: `/business/places`
- Nhóm: `business-center`
- Trạng thái: Đã triển khai

## File liên quan

- `apps/web/src/features/business/pages/BusinessPlacesPage.jsx`
- `apps/web/src/features/business/pages/BusinessPages.css`
- `apps/web/src/features/business/components/BusinessCenterNav.jsx`
- `apps/web/src/services/business.service.js`

## Nội dung triển khai

- Quản lý hồ sơ địa điểm, thông tin hiển thị, mô tả, khu vực, liên hệ.
- Preview hồ sơ công khai với ảnh hero và badge tiện ích.
- Thư viện media dạng bento grid.
- Menu management mock với danh sách món.
- Tìm kiếm cơ sở và danh sách địa điểm con.
- Lưu profile vào `chillplace.businessState`.

## Responsive

- Desktop chia layout nội dung và form chỉnh sửa.
- Mobile chuyển một cột, ảnh và menu co gọn theo viewport.

## Kiểm tra

- `npm run build`: thành công.

