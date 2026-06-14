# Settings Page

## Tổng quan

- Nhóm giao diện: `auth-user`
- Route: `/settings`
- Thiết kế tham chiếu:
  - `interface_design/settings__desktop__base/`
  - `interface_design/settings__responsive__base/`
- Trạng thái: Đã triển khai frontend responsive và tương tác mock.

## File triển khai

- `apps/web/src/features/settings/pages/SettingsPage.jsx`
- `apps/web/src/features/settings/pages/SettingsPage.css`
- `apps/web/src/services/settings.service.js`
- `apps/web/src/services/auth.service.js`
- `apps/web/src/app/App.jsx`

## Thành phần và tương tác

- Điều hướng theo năm nhóm: Tài khoản, Thông báo, Quyền riêng tư, Giao diện và Hỗ trợ.
- Hồ sơ cá nhân cho phép sửa tên, khu vực, tiểu sử và đồng bộ với AppShell.
- Đổi mật khẩu mock có kiểm tra mật khẩu hiện tại, độ dài và xác nhận mật khẩu.
- Bật/tắt 2FA, thông báo đẩy, email, cập nhật hệ thống, vị trí và trạng thái hoạt động.
- Chọn quyền xem bài viết, ngôn ngữ và cỡ chữ qua dialog.
- Hiển thị điều khoản dịch vụ, chính sách bảo mật và trạng thái liên kết mạng xã hội.
- Đăng xuất xóa session rồi chuyển về `/login`.
- Toast phản hồi sau khi lưu hoặc thay đổi tùy chọn.

## Mock data và lưu trữ

- `chillplace.userSettings`: lưu toàn bộ tùy chọn giao diện bằng `localStorage`.
- `chillplace.passwordOverrides`: lưu mật khẩu mock đã đổi để lần đăng nhập tiếp theo sử dụng.
- Tái sử dụng `profile.service.js` và session từ `auth.service.js`.

## Responsive

- Desktop dùng bố cục danh mục bên trái và panel nội dung bên phải.
- Mobile chuyển danh mục thành thanh cuộn ngang, hiển thị thẻ hồ sơ nhanh và thu gọn toàn bộ khoảng cách/kích thước.
- Dialog giới hạn chiều cao và cuộn độc lập trên màn hình nhỏ.
- Nút xem hồ sơ và đăng xuất được gom vào header; toast và vùng thao tác được đặt phù hợp với bottom navigation.
- Bố cục account được nén thành khối nhận diện, form thông tin và nhóm bảo mật liên tục để hạn chế cuộn không cần thiết.

## Lưu ý khi trình bày

- Đây là prototype frontend nên dữ liệu được lưu tại trình duyệt, chưa gọi API backend.
- Tất cả nhóm cài đặt dùng chung row component và service lưu trạng thái để dễ thay bằng API sau này.
- Mật khẩu không được lưu theo cách này ở sản phẩm thật; `passwordOverrides` chỉ phục vụ demo luồng frontend.

## Kiểm tra

- `npm run build`: thành công, Vite build 1.650 modules.
