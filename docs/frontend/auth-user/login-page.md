# Login Page `/login`

## Trang Đã Hoàn Thành

Đã triển khai Login Page cho nhóm `frontend-auth-user`, dựa trên hai prototype:

- `interface_design/login__desktop__base/code.html`
- `interface_design/login__desktop__base/screen.png`
- `interface_design/login__responsive__base/code.html`
- `interface_design/login__responsive__base/screen.png`

Route `/login` nằm ngoài `AppShell` để màn hình xác thực không hiển thị sidebar, mobile header hoặc bottom navigation của luồng khám phá.

## File Được Thêm

- `apps/web/src/features/auth/pages/LoginPage.jsx`
  - Page component chính.
  - Form email/mật khẩu có validation.
  - Nút hiện/ẩn mật khẩu.
  - Tuỳ chọn ghi nhớ đăng nhập.
  - Loading và error state.
  - Đăng nhập mock bằng Google hoặc Apple.
  - Điều hướng về route trước đó hoặc Home sau khi đăng nhập thành công.

- `apps/web/src/features/auth/pages/LoginPage.css`
  - Desktop dùng layout ảnh lifestyle bên trái và form bên phải.
  - Tablet/mobile ẩn ảnh lớn, chuyển thành layout form tập trung.
  - Có safe-area, responsive typography, input/button state và reduced motion kế thừa từ global CSS.

- `apps/web/src/services/auth.service.js`
  - Mô phỏng API đăng nhập.
  - Có delay để hiển thị loading state.
  - Kiểm tra email và mật khẩu với mock user.
  - Lưu phiên vào `localStorage` khi chọn ghi nhớ.
  - Lưu phiên vào `sessionStorage` khi không chọn ghi nhớ.
  - Cung cấp `getAuthSession()` và `logout()` cho các trang Auth User tiếp theo.

## File Được Sửa

- `apps/web/src/app/App.jsx`
  - Import `LoginPage`.
  - Thêm route độc lập:

```jsx
<Route path="login" element={<LoginPage />} />
```

- `docs/frontend/frontend-implementation-notes.md`
  - Thêm link note và cập nhật Login Page thành `Đã triển khai`.

## Logic Tương Tác

- Email bắt buộc và phải đúng định dạng.
- Mật khẩu bắt buộc, tối thiểu 8 ký tự.
- Sai thông tin sẽ hiển thị lỗi từ mock service.
- Nút đăng nhập bị disable và có spinner trong lúc xử lý.
- Nút Google/Apple mô phỏng đăng nhập nhà cung cấp.
- `Quên mật khẩu?` điều hướng tới `/forgot-password`.
- `Đăng ký ngay` điều hướng tới `/register`.
- Sau khi thành công, trang điều hướng về route trong `location.state.from` nếu có, ngược lại về `/`.

## Tài Khoản Demo

```text
Email: minh@chillplace.vn
Mật khẩu: ChillPlace123
```

## Responsive

- Desktop:
  - Ảnh lifestyle chiếm khoảng 60% chiều rộng.
  - Form đăng nhập chiếm khoảng 40%.
  - Có brand, nội dung giới thiệu, check-in card và footer trên ảnh.

- Tablet/mobile:
  - Ẩn khu vực ảnh desktop.
  - Hiển thị logo dạng app icon.
  - Form một cột, social login xếp dọc trên màn hình nhỏ.
  - Ẩn checkbox ghi nhớ để giữ giao diện gọn giống prototype responsive.

## Điểm Giải Thích Khi Báo Cáo

- Login là route ngoài `AppShell` vì đây là màn hình xác thực toàn trang.
- `auth.service.js` tách logic khỏi UI để sau này thay mock bằng `POST /api/auth/login` mà không phải viết lại layout.
- `localStorage` mô phỏng phiên lâu dài, `sessionStorage` mô phỏng phiên kết thúc khi đóng tab.
- Form dùng controlled state và validation phía frontend trước khi gọi service.

## Kiểm Tra

Đã chạy:

```bash
cd apps/web
npm run build
```

Kết quả:

```text
✓ built in 2.19s
```

