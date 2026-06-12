# Forgot Password Page `/forgot-password`

## Trang Đã Hoàn Thành

Đã triển khai Forgot Password Page cho nhóm `frontend-auth-user`.

Trong `interface_design` chưa có prototype riêng cho Forgot Password, vì vậy giao diện được thiết kế mới nhưng giữ đồng nhất với Login và Register:

- Màu cam thương hiệu.
- Layout xác thực nằm ngoài `AppShell`.
- Desktop có ảnh lifestyle và phần giới thiệu bên trái.
- Mobile dùng logo app, card form và nền gradient nhẹ.

## File Được Thêm

- `apps/web/src/features/auth/pages/ForgotPasswordPage.jsx`
  - Form nhập email.
  - Validation bắt buộc và định dạng email.
  - Loading và error state.
  - Success state sau khi gửi yêu cầu.
  - Cho phép dùng email khác.
  - Gửi lại email với cooldown 30 giây.
  - Liên kết quay lại `/login`.

- `apps/web/src/features/auth/pages/ForgotPasswordPage.css`
  - Layout desktop hai cột.
  - Mobile chuyển sang card form tập trung.
  - Style riêng cho trạng thái thành công, security note, spinner và resend button.
  - Hỗ trợ safe area và màn hình nhỏ.

## File Được Sửa

- `apps/web/src/services/auth.service.js`
  - Thêm `requestPasswordReset(email)`.
  - Kiểm tra email trong tài khoản demo và tài khoản đã đăng ký.
  - Lưu yêu cầu hợp lệ vào localStorage key:

```text
chillplace.passwordResetRequests
```

  - Yêu cầu có thời gian tạo và thời gian hết hạn sau 15 phút.
  - Luôn trả về thông báo chung để không làm lộ email nào đã đăng ký.

- `apps/web/src/app/App.jsx`
  - Import `ForgotPasswordPage`.
  - Thêm route:

```jsx
<Route path="forgot-password" element={<ForgotPasswordPage />} />
```

- `docs/frontend/frontend-implementation-notes.md`
  - Thêm link note và cập nhật trạng thái thành `Đã triển khai`.

## Luồng Hoạt Động

1. Người dùng mở `/forgot-password`.
2. Nhập email và submit.
3. Frontend kiểm tra định dạng email.
4. Mock service mô phỏng gửi yêu cầu reset.
5. Trang chuyển sang success state.
6. Người dùng có thể gửi lại sau 30 giây hoặc đổi email.
7. Nút quay lại đưa người dùng về `/login`.

## Nguyên Tắc Bảo Mật

Trang không hiển thị email có tồn tại trong hệ thống hay không.

Thông báo luôn dùng dạng:

```text
Nếu email thuộc một tài khoản ChillPlace, liên kết đặt lại mật khẩu sẽ được gửi trong vài phút.
```

Điều này tránh việc một người khác dùng form để dò danh sách tài khoản.

## Responsive

- Desktop:
  - Ảnh lifestyle và nội dung khôi phục bên trái.
  - Form hoặc success state bên phải.

- Tablet/mobile:
  - Ẩn ảnh desktop.
  - Logo thương hiệu nằm phía trên.
  - Nội dung nằm trong card trắng.
  - Email dài tự xuống dòng trong success state.

## Điểm Giải Thích Khi Báo Cáo

- Dự án chưa có prototype Forgot Password nên trang được thiết kế theo design token và pattern của Login/Register.
- Reset service là mock cho API tương lai như `POST /api/auth/forgot-password`.
- Cooldown gửi lại giúp hạn chế spam thao tác ở mức frontend.
- Reset request mock có thời hạn 15 phút giống luồng khôi phục thật.

## Kiểm Tra

Đã chạy:

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.26s
```

